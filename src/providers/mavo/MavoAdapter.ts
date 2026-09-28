/**
 * Mavo Adapter — L0 estimate (electric ride-hailing)
 *
 * Status: STUB — awaiting Phase 0 verification.
 * Evidence: Kigali electric ride-hailing product.
 *
 * NOTE: Electric vehicles — confirm whether pricing differs from combustion.
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
  base_fare: 1200,
  minimum_fare: 2500,
  distance_tiers: [
    { up_to_km: 3,    rate_per_km: 520 },
    { up_to_km: null, rate_per_km: 380 },
  ],
  per_minute_rate: 55,
  rounding: 100,
};

export class MavoAdapter extends BaseAdapter {
  readonly providerId = "mavo";

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
      pricingVersion: "mavo-placeholder-v0",
      ok: true,
    };
  }

  async buildDeepLink(_request: HandoffRequest): Promise<DeepLinkResult> {
    return {
      url: "https://mavo.rw",  // TODO: verify
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
