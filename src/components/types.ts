// ─── Shared types ─────────────────────────────────────────────────────────────

/** Subset of the Home Assistant frontend `hass` object used by the card. */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

/** Entry of `hass.entities` (entity registry, display subset). */
export interface HassEntityRegistryEntry {
  entity_id: string;
  device_id?: string;
  platform?: string;
  translation_key?: string;
}

export interface HassLocale {
  language?: string;
  /** "language" | "system" | "12" | "24" */
  time_format?: string;
  /** "local" | "server" */
  time_zone?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  entities?: Record<string, HassEntityRegistryEntry | undefined>;
  config?: { time_zone?: string };
  locale?: HassLocale;
  language?: string;
  callApi<T>(method: "GET" | "POST", path: string): Promise<T>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
  formatEntityState?(stateObj: HassEntity, state?: string): string;
}

export interface OnlyCatCardConfig {
  name?: string;
  device_id: string;
  show_title?: boolean;
}

export type HistoryStateFull = {
  entity_id: string;
  state: string;
  last_changed: string;
};

// HA omits `lc` when last_changed == last_updated (only `lu` is sent).
export type HistoryStateMinimal = { s: string; lc?: number; lu?: number };

export type HistoryEntry = HistoryStateFull | HistoryStateMinimal;

export interface ParsedPeriod {
  /** 0–1 fraction within the query range */
  start: number;
  end: number;
  /** Actual ms timestamps for tooltip display */
  startTs: number;
  endTs: number;
}
