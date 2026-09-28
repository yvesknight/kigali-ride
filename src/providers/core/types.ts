/**
 * Core provider adapter types
 * Every provider adapter implements ProviderAdapter.
 */

export type CapabilityLevel = "L0" | "L1" | "L2";
export type VehicleType = "car" | "moto" | "minibus" | "electric" | "other";
export type QuoteSource = "estimated" | "live";
export type HandoffMethod = "deeplink" | "web" | "store" | "phone";

// ── Capabilities ───────────────────────────────────────────────────────────

export interface ProviderCapabilities {
  level: CapabilityLevel;
  supportsLiveQuotes: boolean;
  supportsBooking: boolean;
  supportsLiveTracking: boolean;
  supportsCancellation: boolean;
  supportsDeepLink: boolean;
  vehicleTypes: VehicleType[];
}

// ── Quote ──────────────────────────────────────────────────────────────────

export interface QuoteRequest {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  pickupAddress?: string;
  dropoffAddress?: string;
  distanceMetres?: number;
  durationSeconds?: number;
}

export interface QuoteResult {
  providerId: string;
  vehicleType: VehicleType;

  priceMin: number;
  priceMax: number;
  currency: string;

  etaSeconds?: number;
  driverAvailable?: boolean;
  driverAssigned?: boolean;

  source: QuoteSource;
  fetchedAt: string;  // ISO 8601
  expiresAt?: string; // ISO 8601
  pricingVersion?: string;

  ok: true;
}

export interface QuoteError {
  providerId: string;
  ok: false;
  errorCode: string;
  errorMessage: string;
}

// ── Booking (L2) ───────────────────────────────────────────────────────────

export interface BookingRequest {
  quoteId: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  userId?: string;
}

export interface BookingResult {
  ok: boolean;
  externalTripId?: string;
  errorCode?: string;
  errorMessage?: string;
}

// ── Trip status ────────────────────────────────────────────────────────────

export interface TripStatus {
  externalTripId: string;
  status: string;
  driverLat?: number;
  driverLng?: number;
  etaSeconds?: number;
  driverName?: string;
  vehiclePlate?: string;
}

// ── Cancellation ───────────────────────────────────────────────────────────

export interface CancelResult {
  ok: boolean;
  errorCode?: string;
}

// ── Deep-link handoff ──────────────────────────────────────────────────────

export interface HandoffRequest {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  pickupAddress?: string;
  dropoffAddress?: string;
}

export interface DeepLinkResult {
  url: string;
  method: HandoffMethod;
  prefillsDestination: boolean;
}

// ── Health ─────────────────────────────────────────────────────────────────

export interface ProviderHealth {
  providerId: string;
  status: "healthy" | "degraded" | "down" | "unknown";
  checkedAt: string;
  latencyMs?: number;
  errorMessage?: string;
}

// ── Adapter interface ──────────────────────────────────────────────────────

export interface ProviderAdapter {
  /** Unique slug — matches providers.slug in the database */
  readonly providerId: string;

  /** Static capability declaration — no network call */
  getCapabilities(): ProviderCapabilities;

  /**
   * Return a price quote (or error) for the given route.
   * L0: calculate locally from fare model.
   * L1/L2: fetch from provider API.
   */
  getQuote(request: QuoteRequest): Promise<QuoteResult | QuoteError>;

  /**
   * Build the deep-link / web URL for handing off to the provider.
   * Always available even for L0 adapters.
   */
  buildDeepLink?(request: HandoffRequest): Promise<DeepLinkResult>;

  /** L2 only — create a booking inside the provider's system */
  createBooking?(request: BookingRequest): Promise<BookingResult>;

  /** L2 only — poll live trip status */
  getStatus?(externalTripId: string): Promise<TripStatus>;

  /** L2 only — cancel a trip */
  cancel?(externalTripId: string): Promise<CancelResult>;

  /** Ping the provider to check availability; used by health monitor */
  healthCheck(): Promise<ProviderHealth>;
}
