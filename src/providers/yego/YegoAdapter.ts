/**
 * YEGO Adapter — L0 (estimate + deep-link handoff)
 *
 * Status: STUB — awaiting Phase 0 provider verification.
 *
 * TODO (Phase 0):
 *   [ ] Verify service is active in Kigali
 *   [ ] Confirm vehicle types (cab, moto?)
 *   [ ] Obtain or reverse-engineer deep-link scheme
 *   [ ] Collect 20+ real fare samples to calibrate rules_json
 *   [ ] Confirm payment methods
 *   [ ] Get partner/API contact
 *   [ ] Review terms for aggregator use
 */

import { BaseAdapter, type FareRules } from "../core/BaseAdapter";
import type {
  DeepLinkResult,
  HandoffRequest,
  ProviderCapabilities,
  ProviderHealth,
  QuoteError,
  QuoteRequest,
  QuoteResult,
} from "../core/types";

// Placeholder fare rules — NOT calibrated. Replace after real-world sampling.
const FARE_RULES: FareRules = {
  base_fare: 1000,
  minimum_fare: 2000,
  distance_tiers: [
    { up_to_km: 2,    rate_per_km: 500 },
    { up_to_km: 10,   rate_per_km: 350 },
    { up_to_km: null, rate_per_km: 300 },
  ],
  per_minute_rate: 50,
  booking_fee: 0,
  surge_multiplier: 1.0,
  rounding: 100,
};

export class YegoAdapter extends BaseAdapter {
  readonly providerId = "yego";

  getCapabilities(): ProviderCapabilities {
    return {
      level: "L0",
      supportsLiveQuotes: false,    // upgrade when API available
      supportsBooking: false,
      supportsLiveTracking: false,
      supportsCancellation: false,
      supportsDeepLink: true,       // TODO: verify scheme
      vehicleTypes: ["car"],        // TODO: confirm moto availability
    };
  }

  async getQuote(request: QuoteRequest): Promise<QuoteResult | QuoteError> {
    if (!request.distanceMetres || !request.durationSeconds) {
      return {
        providerId: this.providerId,
        ok: false,
        errorCode: "MISSING_ROUTE_DATA",
        errorMessage: "Distance and duration required for L0 estimate.",
      };
    }

    const { priceMin, priceMax } = this.estimateFare(
      FARE_RULES,
      request.distanceMetres,
      request.durationSeconds
    );

    return {
      providerId: this.providerId,
      vehicleType: "car",
      priceMin,
      priceMax,
      currency: "RWF",
      source: "estimated",
      fetchedAt: new Date().toISOString(),
      pricingVersion: "yego-placeholder-v0",
      ok: true,
    };
  }

  async buildDeepLink(request: HandoffRequest): Promise<DeepLinkResult> {
    // TODO: replace with verified YEGO deep-link scheme
    // Candidate: yego://ride?pickup_lat=X&pickup_lng=Y&dest_lat=A&dest_lng=B
    const web = `https://yego.rw`;
    return {
      url: web,
      method: "web",
      prefillsDestination: false,
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    // TODO: ping YEGO availability endpoint when API is known
    return {
      providerId: this.providerId,
      status: "unknown",
      checkedAt: new Date().toISOString(),
      errorMessage: "Health check not yet implemented — awaiting Phase 0 verification.",
    };
  }
}
