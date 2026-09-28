-- =============================================================================
-- Kigali Ride Aggregator — Supabase / PostgreSQL Schema
-- Version: 1.0.0
-- =============================================================================
-- Conventions:
--   • All primary keys are UUID (gen_random_uuid())
--   • Timestamps are TIMESTAMPTZ stored in UTC
--   • Row Level Security (RLS) is enabled on every user-facing table
--   • Soft-delete via deleted_at where applicable
--   • JSONB used for flexible/versioned data (fare rules, event properties)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";       -- geospatial queries
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- fuzzy search on addresses


-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE capability_level   AS ENUM ('L0', 'L1', 'L2');
CREATE TYPE vehicle_type        AS ENUM ('car', 'moto', 'minibus', 'electric', 'other');
CREATE TYPE quote_source        AS ENUM ('estimated', 'live');
CREATE TYPE quote_status        AS ENUM ('ok', 'error', 'expired', 'unavailable');
CREATE TYPE handoff_method      AS ENUM ('deeplink', 'web', 'store', 'phone');
CREATE TYPE trip_status         AS ENUM (
    'quote_selected',
    'handoff_attempted',
    'provider_opened',
    'driver_assigned',
    'in_progress',
    'completed',
    'cancelled'
);
CREATE TYPE issue_type          AS ENUM (
    'price_discrepancy',
    'handoff_failure',
    'destination_not_transferred',
    'driver_behaviour',
    'vehicle_condition',
    'fare_dispute',
    'driver_cancelled',
    'lost_property',
    'safety_incident',
    'app_bug',
    'other'
);
CREATE TYPE issue_status        AS ENUM ('open', 'in_review', 'resolved', 'closed');
CREATE TYPE provider_health_status AS ENUM ('healthy', 'degraded', 'down', 'unknown');
CREATE TYPE commission_type     AS ENUM ('referral', 'lead_fee', 'sponsored', 'subscription');


-- =============================================================================
-- 1. USERS
-- =============================================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Supabase auth.users FK (set after auth signup)
    auth_id         UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,

    phone           TEXT UNIQUE NOT NULL,
    name            TEXT,
    language        TEXT NOT NULL DEFAULT 'en'  CHECK (language IN ('en', 'rw')),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at  TIMESTAMPTZ,
    deleted_at      TIMESTAMPTZ                 -- soft delete / GDPR erasure flag
);

-- RLS: users can only read/update their own row
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_self_read   ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY users_self_update ON users FOR UPDATE USING (auth.uid() = auth_id);


-- =============================================================================
-- 2. SAVED PLACES
-- =============================================================================

CREATE TABLE saved_places (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    label       TEXT NOT NULL,                  -- "Home", "Work", custom
    address     TEXT NOT NULL,
    place_id    TEXT,                           -- Google Places place_id
    lat         NUMERIC(10, 7) NOT NULL,
    lng         NUMERIC(10, 7) NOT NULL,

    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY saved_places_owner ON saved_places
    USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));


-- =============================================================================
-- 3. PROVIDERS
-- =============================================================================

CREATE TABLE providers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    slug                TEXT UNIQUE NOT NULL,   -- 'yego', 'move', 'zelo' …
    name                TEXT NOT NULL,
    logo_url            TEXT,
    active              BOOLEAN NOT NULL DEFAULT false,
    capability_level    capability_level NOT NULL DEFAULT 'L0',

    -- Handoff / links
    deep_link_template  TEXT,                   -- e.g. "yego://ride?dest={lat},{lng}"
    web_link            TEXT,
    play_store_url      TEXT,
    phone_number        TEXT,
    support_url         TEXT,
    terms_url           TEXT,

    -- Partner metadata
    partner_contract_id TEXT,
    commission_type     commission_type,
    commission_rate     NUMERIC(6, 4),          -- e.g. 0.0500 = 5 %
    commission_effective_from TIMESTAMPTZ,

    -- Operational
    last_verified_at    TIMESTAMPTZ,
    notes               TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No RLS on providers — read-only public data; writes via service role only
COMMENT ON TABLE providers IS
    'One row per transport provider. Writes are admin/service-role only.';


-- =============================================================================
-- 4. PROVIDER SERVICES  (vehicle types per provider)
-- =============================================================================

CREATE TABLE provider_services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,

    vehicle_type    vehicle_type NOT NULL,
    active          BOOLEAN NOT NULL DEFAULT true,

    -- GeoJSON polygon or PostGIS geometry for coverage area
    coverage_area   GEOMETRY(MULTIPOLYGON, 4326),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (provider_id, vehicle_type)
);


-- =============================================================================
-- 5. FARE MODELS
-- =============================================================================
-- Rules are stored as JSONB to support arbitrary tier structures without
-- schema migrations every time a provider changes pricing.
--
-- Example rules_json:
-- {
--   "base_fare": 1000,
--   "minimum_fare": 2000,
--   "distance_tiers": [
--     { "up_to_km": 2,    "rate_per_km": 500 },
--     { "up_to_km": 10,   "rate_per_km": 350 },
--     { "up_to_km": null, "rate_per_km": 300 }
--   ],
--   "per_minute_rate": 50,
--   "waiting_rate_per_min": 30,
--   "booking_fee": 0,
--   "surge_multiplier": 1.0,
--   "night_surcharge_pct": 10,
--   "night_start": "22:00",
--   "night_end": "05:00",
--   "rounding": 100
-- }

CREATE TABLE fare_models (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id         UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    vehicle_type        vehicle_type NOT NULL,

    pricing_version     TEXT NOT NULL,          -- e.g. '2026-Q3'
    rules_json          JSONB NOT NULL,
    currency            TEXT NOT NULL DEFAULT 'RWF',

    effective_from      TIMESTAMPTZ NOT NULL,
    effective_until     TIMESTAMPTZ,            -- NULL = currently active
    is_active           BOOLEAN NOT NULL DEFAULT false,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX fare_models_active_idx
    ON fare_models (provider_id, vehicle_type)
    WHERE is_active = true;

COMMENT ON COLUMN fare_models.rules_json IS
    'Versioned fare rule blob. See schema comments for example structure.';


-- =============================================================================
-- 6. QUOTE REQUESTS
-- =============================================================================

CREATE TABLE quote_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,  -- nullable = guest

    pickup_lat      NUMERIC(10, 7) NOT NULL,
    pickup_lng      NUMERIC(10, 7) NOT NULL,
    pickup_address  TEXT,

    dropoff_lat     NUMERIC(10, 7) NOT NULL,
    dropoff_lng     NUMERIC(10, 7) NOT NULL,
    dropoff_address TEXT,

    distance_m      INTEGER,                    -- metres, from routing engine
    duration_s      INTEGER,                    -- seconds, from routing engine
    route_source    TEXT,                       -- 'google_directions' | 'osrm' …
    route_polyline  TEXT,                       -- encoded polyline for map display

    session_id      TEXT,                       -- anonymous session tracking
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY quote_requests_owner ON quote_requests
    FOR SELECT USING (
        user_id IS NULL
        OR user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    );

CREATE INDEX quote_requests_user_idx ON quote_requests (user_id);
CREATE INDEX quote_requests_created_idx ON quote_requests (created_at DESC);


-- =============================================================================
-- 7. QUOTES
-- =============================================================================

CREATE TABLE quotes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id      UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
    provider_id     UUID NOT NULL REFERENCES providers(id),
    vehicle_type    vehicle_type NOT NULL,

    -- Pricing
    price_min       INTEGER NOT NULL,           -- in currency minor units (RWF = no decimals)
    price_max       INTEGER NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'RWF',

    -- Availability
    eta_seconds     INTEGER,                    -- NULL = unavailable
    driver_available    BOOLEAN,               -- NULL = unknown
    driver_assigned     BOOLEAN,               -- NULL = unknown

    -- Freshness / provenance
    source          quote_source NOT NULL,
    fetched_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ,
    pricing_version TEXT,                       -- links back to fare_models.pricing_version

    -- State
    status          quote_status NOT NULL DEFAULT 'ok',
    error_code      TEXT,
    error_message   TEXT
);

CREATE INDEX quotes_request_idx   ON quotes (request_id);
CREATE INDEX quotes_provider_idx  ON quotes (provider_id);
CREATE INDEX quotes_fetched_idx   ON quotes (fetched_at DESC);

COMMENT ON COLUMN quotes.driver_available IS
    'Whether the provider confirmed at least one driver is available. '
    'Null = unknown (e.g. L0 estimate with no availability signal).';

COMMENT ON COLUMN quotes.driver_assigned IS
    'Whether a specific driver has been assigned (L2 only). '
    'Distinct from driver_available.';


-- =============================================================================
-- 8. HANDOFFS
-- =============================================================================

CREATE TABLE handoffs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id        UUID NOT NULL REFERENCES quotes(id),
    provider_id     UUID NOT NULL REFERENCES providers(id),

    method          handoff_method NOT NULL,
    attempted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    opened_at       TIMESTAMPTZ,                -- NULL = app never opened
    prefilled       BOOLEAN,                    -- destination pre-filled in provider app
    success         BOOLEAN NOT NULL DEFAULT false,
    failure_reason  TEXT,

    -- Deep-link telemetry
    deep_link_url   TEXT,                       -- resolved URL that was launched
    provider_app_installed BOOLEAN,
    fallback_used   BOOLEAN NOT NULL DEFAULT false,
    fallback_method handoff_method
);

CREATE INDEX handoffs_quote_idx ON handoffs (quote_id);

COMMENT ON TABLE handoffs IS
    'One row per handoff attempt. Multiple rows per quote are possible '
    '(e.g. retry after failure, then fallback).';


-- =============================================================================
-- 9. TRIPS
-- =============================================================================

CREATE TABLE trips (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    quote_id            UUID REFERENCES quotes(id),
    provider_id         UUID NOT NULL REFERENCES providers(id),
    handoff_id          UUID REFERENCES handoffs(id),

    status              trip_status NOT NULL DEFAULT 'quote_selected',
    external_trip_id    TEXT,                   -- provider's own trip reference

    started_at          TIMESTAMPTZ,
    ended_at            TIMESTAMPTZ,
    final_price         INTEGER,                -- actual price paid (if known)
    currency            TEXT DEFAULT 'RWF',

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY trips_owner ON trips
    FOR SELECT USING (
        user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    );

CREATE INDEX trips_user_idx     ON trips (user_id, created_at DESC);
CREATE INDEX trips_provider_idx ON trips (provider_id);
CREATE INDEX trips_status_idx   ON trips (status);


-- =============================================================================
-- 10. RATINGS
-- =============================================================================

CREATE TABLE ratings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id     UUID UNIQUE NOT NULL REFERENCES trips(id) ON DELETE CASCADE,

    stars       SMALLINT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    tags        TEXT[]   NOT NULL DEFAULT '{}',  -- ['price_issue', 'driver_issue', …]
    comment     TEXT,

    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY ratings_trip_owner ON ratings
    FOR SELECT USING (
        trip_id IN (
            SELECT id FROM trips
            WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        )
    );

COMMENT ON COLUMN ratings.tags IS
    'Structured tags from the fixed chip set: '
    'price_issue | driver_issue | pickup_problem | vehicle_problem | '
    'safety_concern | app_problem';


-- =============================================================================
-- 11. ISSUE REPORTS
-- =============================================================================

CREATE TABLE issue_reports (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id             UUID REFERENCES trips(id) ON DELETE SET NULL,
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,

    type                issue_type NOT NULL,
    description         TEXT NOT NULL,
    attachments         TEXT[],                 -- storage object paths

    status              issue_status NOT NULL DEFAULT 'open',
    assigned_to         TEXT,                   -- internal team member (slug/email)
    provider_response   TEXT,
    resolution_notes    TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at         TIMESTAMPTZ,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE issue_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY issue_reports_owner ON issue_reports
    FOR SELECT USING (
        user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    );


-- =============================================================================
-- 12. PROVIDER HEALTH
-- =============================================================================

CREATE TABLE provider_health (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id         UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,

    checked_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    status              provider_health_status NOT NULL DEFAULT 'unknown',

    quote_success_rate  NUMERIC(5, 2),          -- percentage 0.00–100.00
    avg_latency_ms      INTEGER,
    error_rate          NUMERIC(5, 2),
    timeout_count       INTEGER DEFAULT 0,
    sample_size         INTEGER DEFAULT 0,      -- number of requests in window

    notes               TEXT
);

CREATE INDEX provider_health_provider_idx
    ON provider_health (provider_id, checked_at DESC);

COMMENT ON TABLE provider_health IS
    'Time-series health snapshots. Query latest per provider for dashboard.';


-- =============================================================================
-- 13. CONSENT RECORDS  (Privacy compliance)
-- =============================================================================

CREATE TABLE consent_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id      TEXT,

    consent_type    TEXT NOT NULL,   -- 'privacy_policy' | 'terms_of_service' | 'location' …
    version         TEXT NOT NULL,   -- document version user consented to
    granted         BOOLEAN NOT NULL,
    ip_address      INET,
    user_agent      TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX consent_records_user_idx ON consent_records (user_id, consent_type);

COMMENT ON TABLE consent_records IS
    'Immutable audit log of consent actions. Never update or delete rows.';


-- =============================================================================
-- 14. EVENTS  (Analytics / funnel)
-- =============================================================================

CREATE TABLE events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id  TEXT NOT NULL,

    event_name  TEXT NOT NULL,       -- 'app_opened' | 'quote_requested' | 'handoff_attempted' …
    properties  JSONB,               -- arbitrary key/value payload

    platform    TEXT,                -- 'android' | 'ios' | 'web'
    app_version TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partition by month in production; for now a simple index is fine.
CREATE INDEX events_session_idx   ON events (session_id, created_at DESC);
CREATE INDEX events_name_idx      ON events (event_name, created_at DESC);
CREATE INDEX events_user_idx      ON events (user_id, created_at DESC) WHERE user_id IS NOT NULL;

COMMENT ON TABLE events IS
    'Append-only analytics stream. '
    'Funnel: app_opened → pickup_entered → destination_entered → '
    'quote_requested → options_shown → option_selected → '
    'handoff_attempted → provider_opened → booking_completed → '
    'trip_completed → feedback_submitted';


-- =============================================================================
-- 15. AUDIT LOGS  (Security)
-- =============================================================================

CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID,                -- user or service account
    actor_type  TEXT,                -- 'user' | 'admin' | 'service'

    action      TEXT NOT NULL,       -- 'provider.updated' | 'fare_model.published' …
    table_name  TEXT,
    record_id   UUID,
    diff        JSONB,               -- before/after snapshot

    ip_address  INET,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX audit_logs_actor_idx  ON audit_logs (actor_id, created_at DESC);
CREATE INDEX audit_logs_table_idx  ON audit_logs (table_name, record_id);

COMMENT ON TABLE audit_logs IS
    'Immutable audit trail. Row-level updates trigger inserts here via triggers.';


-- =============================================================================
-- 16. FEATURE FLAGS  (Ops / kill-switch)
-- =============================================================================

CREATE TABLE feature_flags (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         TEXT UNIQUE NOT NULL,   -- 'provider.yego.enabled' | 'fare_model.v2'
    enabled     BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    updated_by  TEXT,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO feature_flags (key, enabled, description) VALUES
    ('provider.yego.enabled',       false, 'Enable YEGO quotes and handoff'),
    ('provider.move.enabled',       false, 'Enable Move quotes and handoff'),
    ('provider.zelo.enabled',       false, 'Enable Zelo quotes and handoff'),
    ('provider.tugende.enabled',    false, 'Enable Tugende quotes and handoff'),
    ('provider.rapide.enabled',     false, 'Enable Rapide quotes and handoff'),
    ('provider.greenride.enabled',  false, 'Enable GreenRide quotes and handoff'),
    ('provider.mavo.enabled',       false, 'Enable Mavo quotes and handoff'),
    ('comparison.live_quotes',      false, 'Show live L1 quotes on comparison screen'),
    ('handoff.deeplink',            true,  'Attempt deep-link handoff before web fallback'),
    ('onboarding.skip_auth',        true,  'Allow guest comparison without signup');

COMMENT ON TABLE feature_flags IS
    'Kill-switch and rollout flags. Update rows to toggle without a deploy.';


-- =============================================================================
-- Seed: Provider stubs  (all inactive until verified)
-- =============================================================================

INSERT INTO providers (slug, name, active, capability_level, notes) VALUES
    ('yego',      'YEGO',      false, 'L0', 'Active Kigali passenger app. Target integration.'),
    ('move',      'Move',      false, 'L0', 'Active Kigali ride app (updated Aug 2026). Target integration.'),
    ('zelo',      'Zelo',      false, 'L0', 'Kigali app with ride functionality (updated Sep 2026). Investigate.'),
    ('tugende',   'Tugende',   false, 'L0', 'Official site advertises rides 24/7 in Kigali. Investigate.'),
    ('rapide',    'Rapide',    false, 'L0', 'Kigali ride app (updated Sep 2026). Investigate.'),
    ('greenride', 'GreenRide', false, 'L0', 'Current Kigali/Rwanda ride app (updated Sep 2026). Investigate.'),
    ('mavo',      'Mavo',      false, 'L0', 'Kigali electric ride-hailing product. Investigate.');

COMMENT ON TABLE providers IS
    'All providers seeded inactive. Set active=true only after Phase 0 '
    'verification (see PRD §2 Provider Capability Matrix).';
