/**
 * BaseAdapter
 *
 * Abstract base class all provider adapters extend.
 * Provides:
 *   - L0 fare estimation from a rules JSON blob
 *   - Default deep-link builder (web fallback)
 *   - Default health check (returns 'unknown')
 *
 * Concrete adapters override only what their capability level supports.
 */

import type {
  BookingRequest,
  BookingResult,
  CancelResult,
  DeepLinkResult,
  HandoffRequest,
  ProviderAdapter,
  ProviderCapabilities,
  ProviderHealth,
  QuoteError,
  QuoteRequest,
  QuoteResult,
  TripStatus,
  VehicleType,
} from "./types";

export interface FareRules {
  base_fare: number;
  minimum_fare: number;
  distance_tiers: Array<{
    up_to_km: number | null;   // null = catch-all
    rate_per_km: number;
  }>;
  per_minute_rate: number;
  waiting_rate_per_min?: number;
  booking_fee?: number;
  surge_multiplier?: number;
  night_surcharge_pct?: number;
  night_start?: string;  // "HH:MM"
  night_end?: string;    // "HH:MM"
  rounding?: number;
}

export abstract class BaseAdapter implements ProviderAdapter {
  abstract readonly providerId: string;
  abstract getCapabilities(): ProviderCapabilities;

  // ── L0 fare estimation ────────────────────────────────────────────────────

  protected estimateFare(
    rules: FareRules,
    distanceMetres: number,
    durationSeconds: number
  ): { priceMin: number; priceMax: number } {
    const km = distanceMetres / 1000;
    const minutes = durationSeconds / 60;
    const surge = rules.surge_multiplier ?? 1.0;

    // Distance cost
    let distanceCost = 0;
    let remaining = km;
    for (const tier of rules.distance_tiers) {
      if (remaining <= 0) break;
      const tierKm =
        tier.up_to_km != null
          ? Math.min(remaining, tier.up_to_km - (km - remaining))
          : remaining;
      distanceCost += tierKm * tier.rate_per_km;
      remaining -= tierKm;
      if (tier.up_to_km == null) break;
    }

    const timeCost = minutes * rules.per_minute_rate;
    const raw =
      (rules.base_fare + distanceCost + timeCost + (rules.booking_fee ?? 0)) *
      surge;

    const total = Math.max(raw, rules.minimum_fare);
    const rounded = rules.rounding
      ? Math.ceil(total / rules.rounding) * rules.rounding
      : Math.round(total);

    // For L0 estimates, show ±10% range to signal uncertainty
    return {
      priceMin: Math.round(rounded * 0.9 / (rules.rounding ?? 1)) * (rules.rounding ?? 1),
      priceMax: Math.round(rounded * 1.1 / (rules.rounding ?? 1)) * (rules.rounding ?? 1),
    };
  }

  // ── Default implementations ───────────────────────────────────────────────

  async getQuote(_request: QuoteRequest): Promise<QuoteResult | QuoteError> {
    return {
      providerId: this.providerId,
      ok: false,
      errorCode: "NOT_IMPLEMENTED",
      errorMessage: `${this.providerId} adapter has not implemented getQuote()`,
    };
  }

  async buildDeepLink(request: HandoffRequest): Promise<DeepLinkResult> {
    // Default: open the provider's web link
    const caps = this.getCapabilities();
    return {
      url: `https://example.com`,   // concrete adapters override with real URLs
      method: "web",
      prefillsDestination: false,
    };
  }

  // L2 stubs — concrete L2 adapters override these
  async createBooking(_request: BookingRequest): Promise<BookingResult> {
    return { ok: false, errorCode: "NOT_SUPPORTED" };
  }

  async getStatus(_externalTripId: string): Promise<TripStatus> {
    return { externalTripId: _externalTripId, status: "unknown" };
  }

  async cancel(_externalTripId: string): Promise<CancelResult> {
    return { ok: false, errorCode: "NOT_SUPPORTED" };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      providerId: this.providerId,
      status: "unknown",
      checkedAt: new Date().toISOString(),
    };
  }
}
