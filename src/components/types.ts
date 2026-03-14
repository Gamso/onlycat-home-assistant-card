// ─── Shared types ─────────────────────────────────────────────────────────────

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
