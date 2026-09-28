/**
 * Move Adapter — L0 initially, target L1
 *
 * Status: STUB — awaiting Phase 0 provider verification.
 *
 * TODO (Phase 0):
 *   [ ] Verify service active in Kigali (Android listing updated Aug 2026)
 *   [ ] Confirm vehicle types
 *   [ ] Test deep-link scheme
 *   [ ] Collect fare samples
 *   [ ] Investigate API / partner programme
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

const FARE_RULES: FareRules = {
  base_fare: 1000,
  minimum_fare: 2000,
  distance_tiers: [
    { up_to_km: 3,    rate_per_km: 480 },
    { up_to_km: null, rate_per_km: 320 },
  ],
  per_minute_rate: 45,
  rounding: 50,
};

export class MoveAdapter extends BaseAdapter {
  readonly providerId = "move";

  getCapabilities(): ProviderCapabilities {
    return {
      level: "L0",
      supportsLiveQuotes: false,
      supportsBooking: false,
      supportsLiveTracking: false,
      supportsCancellation: false,
      supportsDeepLink: true,
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
      pricingVersion: "move-placeholder-v0",
      ok: true,
    };
  }

  async buildDeepLink(_request: HandoffRequest): Promise<DeepLinkResult> {
    // TODO: verify Move deep-link scheme
    return {
      url: "https://move.rw",
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
