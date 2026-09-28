/**
 * Tugende Adapter — L0 estimate
 *
 * Status: STUB — awaiting Phase 0 verification.
 * Evidence: Official site advertises 24/7 rides in Kigali.
 *
 * TODO (Phase 0):
 *   [ ] Confirm Kigali passenger ride-hailing (vs lease/asset financing product)
 *   [ ] Verify vehicle types
 *   [ ] Collect fare samples
 *   [ ] Test deep-link / booking flow
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

const FARE_RULES: FareRules = {
  base_fare: 1000,
  minimum_fare: 2000,
  distance_tiers: [
    { up_to_km: 5,    rate_per_km: 420 },
    { up_to_km: null, rate_per_km: 300 },
  ],
  per_minute_rate: 40,
  rounding: 100,
};

export class TuendeAdapter extends BaseAdapter {
  readonly providerId = "tugende";

  getCapabilities(): ProviderCapabilities {
    return {
      level: "L0",
      supportsLiveQuotes: false,
      supportsBooking: false,
      supportsLiveTracking: false,
      supportsCancellation: false,
      supportsDeepLink: false,     // TODO: investigate
      vehicleTypes: ["car"],
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
      pricingVersion: "tugende-placeholder-v0",
      ok: true,
    };
  }

  async buildDeepLink(_request: HandoffRequest): Promise<DeepLinkResult> {
    return {
      url: "https://tugende.co",  // TODO: verify Kigali ride URL
      method: "web",
      prefillsDestination: false,
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      providerId: this.providerId,
      status: "unknown",
      checkedAt: new Date().toISOString(),
    };
  }
}
