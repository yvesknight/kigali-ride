/**
 * Rapide Adapter — L0 estimate
 *
 * Status: STUB — awaiting Phase 0 verification.
 * Evidence: Kigali ride app listing updated Sep 2026.
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
  minimum_fare: 1800,
  distance_tiers: [
    { up_to_km: 4,    rate_per_km: 450 },
    { up_to_km: null, rate_per_km: 320 },
  ],
  per_minute_rate: 45,
  rounding: 100,
};

export class RapideAdapter extends BaseAdapter {
  readonly providerId = "rapide";

  getCapabilities(): ProviderCapabilities {
    return {
      level: "L0",
      supportsLiveQuotes: false,
      supportsBooking: false,
      supportsLiveTracking: false,
      supportsCancellation: false,
      supportsDeepLink: false,
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
      pricingVersion: "rapide-placeholder-v0",
      ok: true,
    };
  }

  async buildDeepLink(_request: HandoffRequest): Promise<DeepLinkResult> {
    return {
      url: "https://rapide.rw",  // TODO: verify
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
