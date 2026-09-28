# Kigali Ride — MVP Foundation

> Compare ride options in one place, then book or open the right provider quickly.

Android-first ride aggregator for Kigali. Lets riders compare available options across YEGO, Move, Zelo, Tugende, Rapide, GreenRide, and Mavo — with a clear distinction between live quotes and estimates — then hands off to the chosen provider with minimal friction.

**Current state:** Foundation scaffold only. All screens are placeholder UI. No real APIs connected. Verify structure before building features.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Mobile | React Native + Expo SDK 57 | Android-first, fast iteration |
| Navigation | Expo Router (file-based) | Type-safe routes, no manual stack config |
| Backend | Supabase (Postgres + Auth + Storage) | RLS, realtime, edge functions |
| Maps | Google Maps Platform | Places API, routing, distance matrix |
| Language | TypeScript throughout | Strict types on quotes, adapters, trips |

---

## Project Structure

```
kigali-ride/
│
├── app/                          # Expo Router screens (file = route)
│   ├── _layout.tsx               # Root stack — SafeAreaProvider, StatusBar
│   ├── index.tsx                 # Entry → redirects to splash
│   │
│   ├── (onboarding)/             # Onboarding group (no tabs)
│   │   ├── _layout.tsx
│   │   ├── splash.tsx            # SCREEN 1 — Brand, provider pills
│   │   ├── location-permission.tsx  # SCREEN 2 — Location access
│   │   └── auth.tsx              # SCREEN 3 — Phone + OTP (optional)
│   │
│   ├── (tabs)/                   # Main app — bottom tab navigator
│   │   ├── _layout.tsx           # Tab config (Home / Trips / Profile)
│   │   ├── home.tsx              # SCREEN 4 — Map + bottom sheet + saved places
│   │   ├── history.tsx           # SCREEN 11 — Trip history (auth gated)
│   │   └── profile.tsx           # SCREEN 12 — Profile, saved places, settings
│   │
│   ├── search.tsx                # SCREEN 5 — Destination search (Google Places)
│   ├── compare.tsx               # SCREEN 6 — ★ Comparison screen (core product)
│   ├── help.tsx                  # SCREEN 13 — Help, support boundaries
│   │
│   ├── option/[quoteId].tsx      # SCREEN 7 — Option detail, pricing breakdown
│   ├── handoff/[quoteId].tsx     # SCREEN 8 — Handoff resolver + safety tools
│   ├── trip/[tripId].tsx         # SCREEN 9 — Live trip (driver card, safety)
│   └── rating/[tripId].tsx       # SCREEN 10 — Rating + structured feedback tags
│
├── src/
│   ├── theme/                    # Design tokens
│   │   ├── colors.ts             # Palette (primary red, accent amber, warm surfaces)
│   │   ├── typography.ts         # Font sizes, weights, line heights
│   │   ├── spacing.ts            # 4pt scale, border radii, shadows
│   │   └── index.ts
│   │
│   ├── components/
│   │   └── ui/                   # Shared primitives
│   │       ├── ScreenShell.tsx   # Safe-area wrapper + optional header
│   │       ├── PlaceholderBlock.tsx  # Dashed placeholder tile
│   │       ├── Button.tsx        # primary / secondary / ghost variants
│   │       ├── Badge.tsx         # LIVE / ESTIMATE / ASSIGNED chips
│   │       ├── Divider.tsx
│   │       └── index.ts
│   │
│   ├── types/                    # Shared TypeScript types
│   │   ├── provider.ts           # Quote, Provider, HandoffResult, etc.
│   │   ├── trip.ts               # Trip, Rating, IssueReport
│   │   └── index.ts
│   │
│   └── providers/                # Provider adapter layer
│       ├── core/
│       │   ├── types.ts          # ProviderAdapter interface + all request/result types
│       │   ├── BaseAdapter.ts    # Abstract base: L0 fare engine, default healthCheck
│       │   └── registry.ts       # Central adapter map (imported by quote engine)
│       │
│       ├── yego/YegoAdapter.ts   # STUB — L0, car
│       ├── move/MoveAdapter.ts   # STUB — L0, car
│       ├── zelo/ZeloAdapter.ts   # STUB — L0, moto + car
│       ├── tugende/TugendeAdapter.ts  # STUB — L0, car
│       ├── rapide/RapideAdapter.ts    # STUB — L0, car
│       ├── greenride/GreenRideAdapter.ts  # STUB — L0, electric
│       └── mavo/MavoAdapter.ts   # STUB — L0, electric
│
└── database/
    └── schema.sql                # Full Supabase/Postgres schema
```

---

## Navigation Map

```
Splash
  └─► Location Permission
        └─► (tabs) Home  ◄────────────────────────────────────┐
              └─► Search                                       │
                    └─► Compare ──────── sort: Price/ETA/Provider
                          └─► Option Detail                    │
                                └─► Handoff Status             │
                                      ├─► (success) Live Trip  │
                                      │         └─► Rating ────┘
                                      └─► (failed) Fallbacks

(tabs) Trips    ──── auth gate ──► Auth (OTP)
(tabs) Profile  ──── auth gate ──► Auth (OTP)
Profile ──► Help & Support
```

---

## Database Schema (16 tables)

| Table | Purpose |
|---|---|
| `users` | Phone-based accounts, soft-delete for GDPR |
| `saved_places` | Home / Work / custom pins per user |
| `providers` | One row per transport provider (all seeded inactive) |
| `provider_services` | Vehicle types + PostGIS coverage area per provider |
| `fare_models` | Versioned JSONB fare rules — publishable/rollback-able |
| `quote_requests` | Every pickup→dropoff request (guest + authenticated) |
| `quotes` | Individual provider quotes with freshness fields |
| `handoffs` | Deep-link attempt record + fallback telemetry |
| `trips` | User trip lifecycle across all status transitions |
| `ratings` | Stars + structured tag chips + optional comment |
| `issue_reports` | Aggregator vs provider issue routing |
| `provider_health` | Time-series health snapshots for ops dashboard |
| `consent_records` | Immutable privacy consent audit log |
| `events` | Analytics funnel (append-only) |
| `audit_logs` | Security audit trail |
| `feature_flags` | Kill-switch per provider — no redeploy needed |

RLS is enabled on all user-facing tables. Provider writes are service-role only.

---

## Provider Adapter Architecture

Three capability levels from the PRD:

```
L0 — Estimate + deep-link handoff
     ├── Local fare calculation from rules_json
     ├── No live availability signal
     └── Open provider app / web / store

L1 — Live quote (upgrade path)
     ├── Price from provider API
     ├── Real ETA
     └── Quote expiry timestamp

L2 — Full partner integration (future)
     ├── Book inside the app
     ├── Driver assignment
     └── Live status + cancellation
```

All adapters implement `ProviderAdapter` (see `src/providers/core/types.ts`).
Every adapter has a `getCapabilities()` method — the UI uses this to decide what to show without querying the provider.

**All 7 providers are currently L0 stubs.** Every adapter file has a `TODO (Phase 0)` checklist that must be completed before the provider goes live.

---

## Screens (13 total)

| # | Screen | Route | Status |
|---|---|---|---|
| 1 | Splash | `/(onboarding)/splash` | Placeholder |
| 2 | Location Permission | `/(onboarding)/location-permission` | Placeholder |
| 3 | Auth / OTP | `/(onboarding)/auth` | Placeholder |
| 4 | Home / Map | `/(tabs)/home` | Placeholder |
| 5 | Destination Search | `/search` | Placeholder |
| 6 | **Comparison** | `/compare` | Placeholder (stub data) |
| 7 | Option Detail | `/option/[quoteId]` | Placeholder |
| 8 | Handoff Status | `/handoff/[quoteId]` | Placeholder (state machine) |
| 9 | Live Trip | `/trip/[tripId]` | Placeholder |
| 10 | Trip Completed / Rating | `/rating/[tripId]` | Placeholder |
| 11 | History | `/(tabs)/history` | Placeholder (auth gate) |
| 12 | Profile / Saved Places | `/(tabs)/profile` | Placeholder (auth gate) |
| 13 | Help & Support | `/help` | Placeholder |

---

## Design Tokens

**Aesthetic:** Clean, minimal, warm  
Inspired by Kigali's red-clay hills and modern urban texture.

| Token | Value | Usage |
|---|---|---|
| `primary` | `#C0392B` | CTAs, active tabs, brand |
| `accent` | `#E67E22` | Live quote badges, highlights |
| `surface` | `#FDFAF7` | Main background (warm off-white) |
| `success` | `#27AE60` | Driver assigned, confirmed |
| `warning` | `#F39C12` | Expiring quotes, estimates |
| `dark` | `#1A1A1A` | Primary text |

---

## Running the App

```bash
cd kigali-ride
npm install          # already done
npm run android      # requires Android emulator or device
npm start            # Expo Go / development server
```

> Long-running dev server: run `npm start` or `npm run android` manually in your terminal — do not run via Kiro.

---

## What's NOT built yet

Per PRD — deliberately out of scope for this foundation:

- Real location detection (expo-location)
- Google Maps / Places API integration
- Supabase client setup and queries
- Real OTP authentication
- Provider API calls (all adapters are stubs)
- Deep-link resolution logic
- Quote aggregation engine
- Fare calibration (real-world ride samples needed)
- Admin / operations panel
- Analytics event emission
- Push notifications
- Privacy policy / terms pages

---

## Phase 0 Before Any Feature Work

From PRD §31 — these must happen before coding features:

1. **Verify every provider** — active service, Kigali coverage, vehicle types, fare method, deep-link, API possibility, terms
2. **Build a Provider Capability Matrix** — one row per provider, one column per verification criterion
3. **Investigate RwandaRide** — existing Kigali comparison site (understand differentiation)
4. **Start privacy/compliance work** — Rwanda DPP framework applies to location data
5. **Collect 20+ fare samples per provider** — calibrate the `rules_json` in each adapter

**No provider should go `active = true` in the database until Phase 0 is complete.**

---

## Launch Gates (from PRD §32)

| Gate | Criterion |
|---|---|
| Provider | ≥ 2 providers with verified handoff paths |
| Pricing | Every estimate has a documented source and timestamp |
| Legal | Privacy/terms/data-processing reviewed |
| Reliability | One provider offline doesn't break comparison |
| Handoff | App knows whether handoff succeeded |
| Support | Defined process for aggregator vs provider complaints |
