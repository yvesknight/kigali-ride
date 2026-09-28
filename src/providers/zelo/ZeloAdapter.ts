/**
 * Zelo Adapter — L0 (moto-focused estimate)
 *
 * Status: STUB — awaiting Phase 0 verification.
 * Evidence: Kigali app listing updated Sep 10 2026.
 *
 * TODO (Phase 0):
 *   [ ] Confirm moto + car availability
 *   [ ] Verify Kigali coverage area
 *   [ ] Collect fare samples (moto fares differ significantly from car)
 *   [ ] Test deep-link / share-trip flow
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

const MOTO_FARE_RULES: FareRules = {
  base_fare: 500,
  minimum_fare: 1000,
  distance_tiers: [
    { up_to_km: 3,    rate_per_km: 300 },
    { up_to_km: null, rate_per_km: 200 },
  ],
  per_minute_rate: 20,
  rounding: 100,
};

export class ZeloAdapter extends BaseAdapter {
  readonly providerId = "zelo";

  getCapabilities(): ProviderCapabilities {
    return {
      level: "L0",
      supportsLiveQuotes: false,
      supportsBooking: false,
      supportsLiveTracking: false,
      supportsCancellation: false,
      supportsDeepLink: true,
      vehicleTypes: ["moto", "car"],   // TODO: verify
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
      MOTO_FARE_RULES,
      request.distanceMetres,
      request.durationSeconds
    );

    return {
      providerId: this.providerId,
      vehicleType: "moto",
      priceMin,
      priceMax,
      currency: "RWF",
      source: "estimated",
      fetchedAt: new Date().toISOString(),
      pricingVersion: "zelo-placeholder-v0",
      ok: true,
    };
  }

  async buildDeepLink(_request: HandoffRequest): Promise<DeepLinkResult> {
    return {
      url: "https://zelo.rw",  // TODO: verify
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
