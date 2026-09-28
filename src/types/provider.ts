/** Provider capability levels from the PRD */
export type CapabilityLevel = "L0" | "L1" | "L2";

export type VehicleType = "car" | "moto" | "minibus" | "electric";

export type QuoteSource = "estimated" | "live";

export type QuoteStatus = "ok" | "error" | "expired" | "unavailable";

export type HandoffMethod = "deeplink" | "web" | "store" | "phone";

export interface Provider {
  id: string;
  name: string;
  capabilityLevel: CapabilityLevel;
  color: string;
  active: boolean;
}

export interface Quote {
  id: string;
  requestId: string;
  providerId: string;
  vehicleType: VehicleType;

  priceMin: number;
  priceMax: number;
  currency: string;

  etaSeconds?: number;

  source: QuoteSource;
  fetchedAt: string; // ISO
  expiresAt?: string; // ISO

  status: QuoteStatus;
  errorCode?: string;
}

export interface HandoffResult {
  attempted: boolean;
  opened: boolean;
  prefilled: boolean;
  method: HandoffMethod;
  failureReason?: string;
}
