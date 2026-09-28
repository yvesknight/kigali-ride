/**
 * Provider Registry
 *
 * Central map of all adapter instances.
 * The quote engine and handoff engine import from here.
 *
 * Feature flags gate which providers are actually queried at runtime —
 * the registry itself is always fully populated.
 */
import type { ProviderAdapter } from "./types";
import { YegoAdapter }      from "../yego/YegoAdapter";
import { MoveAdapter }      from "../move/MoveAdapter";
import { ZeloAdapter }      from "../zelo/ZeloAdapter";
import { TuendeAdapter }    from "../tugende/TugendeAdapter";
import { RapideAdapter }    from "../rapide/RapideAdapter";
import { GreenRideAdapter } from "../greenride/GreenRideAdapter";
import { MavoAdapter }      from "../mavo/MavoAdapter";

const registry: Record<string, ProviderAdapter> = {
  yego:      new YegoAdapter(),
  move:      new MoveAdapter(),
  zelo:      new ZeloAdapter(),
  tugende:   new TuendeAdapter(),
  rapide:    new RapideAdapter(),
  greenride: new GreenRideAdapter(),
  mavo:      new MavoAdapter(),
};

export function getAdapter(providerId: string): ProviderAdapter | undefined {
  return registry[providerId];
}

export function getAllAdapters(): ProviderAdapter[] {
  return Object.values(registry);
}

export function getAdapterIds(): string[] {
  return Object.keys(registry);
}
