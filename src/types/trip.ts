export type TripStatus =
  | "quote_selected"
  | "handoff_attempted"
  | "provider_opened"
  | "driver_assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Trip {
  id: string;
  userId?: string;
  quoteId: string;
  providerId: string;
  status: TripStatus;
  externalTripId?: string;
  startedAt?: string;
  endedAt?: string;
  finalPrice?: number;
  handoffId?: string;
}

export interface Rating {
  tripId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  comment?: string;
}

export interface IssueReport {
  tripId: string;
  type: string;
  description: string;
}
