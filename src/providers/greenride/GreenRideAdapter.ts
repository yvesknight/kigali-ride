/**
 * GreenRide Adapter — L0 estimate (electric vehicles)
 *
 * Status: STUB — awaiting Phase 0 verification.
 * Evidence: Current Kigali/Rwanda ride app listing updated Sep 2026.
 *
 * NOTE: Electric vehicles may have different fare structures.
 * Confirm whether GreenRide uses time-based or distance-based pricing.
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
  base_fare: 1500,
  minimum_fare: 3000,
  distance_tiers: [
    { up_to_km: 5,    rate_per_km: 550 },
    { up_to_km: null, rate_per_km: 400 },
  ],
  per_minute_rate: 60,
  rounding: 100,
};

export class GreenRideAdapter extends BaseAdapter {
  readonly providerId = "greenride";

  getCapabilities(): ProviderCapabilities {
    return {
      level: "L0",
      supportsLiveQuotes: false,
      supportsBooking: false,
      supportsLiveTracking: false,
      supportsCancellation: false,
      supportsDeepLink: false,
      vehicleTypes: ["electric"],
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
      vehicleType: "electric",
      priceMin,
      priceMax,
      currency: "RWF",
      source: "estimated",
      fetchedAt: new Date().toISOString(),
      pricingVersion: "greenride-placeholder-v0",
      ok: true,
    };
  }

  async buildDeepLink(_request: HandoffRequest): Promise<DeepLinkResult> {
    return {
      url: "https://greenride.rw",  // TODO: verify
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
