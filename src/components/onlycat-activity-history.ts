import { LitElement, html, nothing, svg, css } from "lit";
import { property, state } from "lit/decorators.js";
import { localize } from "../localize/localize";
import type { HistoryEntry, HistoryStateFull, ParsedPeriod } from "./types";

class OnlyCatActivityHistory extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @property() public eventEntityId!: string;
  @property() public contrabandEntityId!: string;
  @property() public humanEntityId!: string;
  @property() public lockEntityId?: string;
  @property({ type: Number }) public historyHours = 24;

  @state() private _show = false;
  @state() private _loading = false;
  @state() private _hasFetched = false;
  @state() private _error: string | null = null;
  @state() private _data: ParsedPeriod[][] = [[], [], []];
  @state() private _lockData: ParsedPeriod[] = [];
  /** 0 = current window, 1 = one window back, etc. */
  @state() private _offsetPages = 0;
  @state() private _zoom: {
    centerTs: number;
    highlightStartTs: number;
    highlightEndTs: number;
    color: string;
    label: string;
    rowIndex: number;
    eventIndex: number;
  } | null = null;
  private _zoomTimer?: ReturnType<typeof setTimeout>;

  // ── Time window ───────────────────────────────────────────────────────────

  private _timeWindow(): { start: Date; end: Date } {
    // Calendar-day windows: midnight → midnight (or → now for current day).
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const start = new Date(
      todayStart.getTime() - this._offsetPages * 86_400_000,
    );
    const end =
      this._offsetPages === 0
        ? new Date()
        : new Date(start.getTime() + 86_400_000);
    return { start, end };
  }

  private _isEntityOn(id: string): boolean {
    return this.hass?.states?.[id]?.state === "on";
  }

  // ── History loading ───────────────────────────────────────────────────────

  private async _load() {
    if (this._loading) return;
    this._loading = true;
    this._error = null;
    try {
      const { start, end } = this._timeWindow();
      const baseIds = [
        this.eventEntityId,
        this.contrabandEntityId,
        this.humanEntityId,
      ];
      const orderedIds = this.lockEntityId
        ? [...baseIds, this.lockEntityId]
        : baseIds;
      const entityIds = orderedIds.join(",");

      const path =
        `history/period/${start.toISOString()}` +
        `?filter_entity_id=${entityIds}` +
        `&end_time=${end.toISOString()}` +
        `&minimal_response&no_attributes&significant_changes_only=false`;

      const raw = (await this.hass.callApi("GET", path)) as HistoryEntry[][];
      if (!Array.isArray(raw)) {
        this._data = [[], [], []];
        this._lockData = [];
        return;
      }

      const timeRange = end.getTime() - start.getTime();
      const result: ParsedPeriod[][] = [[], [], [], []];

      console.debug(
        "[OnlyCat] raw API response:",
        raw.map((s) => `${(s[0] as any)?.entity_id}: ${s.length} entries`),
      );

      for (const series of raw) {
        if (!series?.length) continue;

        const first = series[0] as HistoryStateFull;
        const idx = orderedIds.indexOf(first.entity_id);
        if (idx === -1) continue;

        let onSince: number | null = null;
        let onCount = 0;

        for (const entry of series) {
          let stateStr: string;
          let ts: number;

          const e = entry as any;
          if ("state" in e) {
            // Full-format entry (first entry always has entity_id + state,
            // but HA may also return subsequent entries with state/last_changed
            // instead of the minimal s/lc format).
            stateStr = e.state;
            ts = new Date(e.last_changed).getTime();
          } else {
            stateStr = e.s;
            // HA minimal_response: `lc` is seconds-since-epoch (< 1e12).
            // `lc` is omitted by HA when last_changed == last_updated; fall
            // back to `lu` in that case (same timestamp, different field name).
            const lcSec = e.lc ?? e.lu;
            if (lcSec === undefined) continue;
            ts = lcSec > 1e12 ? lcSec : lcSec * 1000;
          }

          if (stateStr === "on" && onSince === null) {
            onSince = ts;
            onCount++;
          } else if (stateStr !== "on" && onSince !== null) {
            result[idx].push({
              start: Math.max(0, (onSince - start.getTime()) / timeRange),
              end: Math.min(1, (ts - start.getTime()) / timeRange),
              startTs: onSince,
              endTs: ts,
            });
            onSince = null;
          }
        }
        if (onSince !== null) {
          result[idx].push({
            start: Math.max(0, (onSince - start.getTime()) / timeRange),
            end: 1,
            startTs: onSince,
            endTs: end.getTime(),
          });
        }
        console.debug(
          `[OnlyCat] ${first.entity_id}: ${series.length} entries → ${onCount} "on" transitions → ${result[idx].length} periods`,
        );
      }

      // Dump every parsed period so the user can compare with HA history page
      for (let ri = 0; ri < result.length; ri++) {
        const name = ["event", "contraband", "human", "lock"][ri];
        for (const p of result[ri]) {
          console.debug(
            `[OnlyCat] ${name} period: ${new Date(p.startTs).toISOString()} → ${new Date(p.endTs).toISOString()} (${Math.round((p.endTs - p.startTs) / 1000)}s)`,
          );
        }
      }
      console.debug(
        "[OnlyCat] history parsed",
        result.map(
          (a, i) => `${["event", "contraband", "human", "lock"][i]}:${a.length}`,
        ),
      );
      this._data = [result[0], result[1], result[2]];
      this._lockData = result[3] ?? [];
      this._hasFetched = true;
    } catch (e) {
      console.error("[OnlyCat] history error", e);
      this._error = localize(this.hass, "history.error");
    } finally {
      this._loading = false;
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  private _toggle() {
    this._show = !this._show;
    if (this._show) this._load();
  }

  private _navPrev() {
    this._offsetPages++;
    this._load();
  }

  private _navNext() {
    if (this._offsetPages > 0) {
      this._offsetPages--;
      this._load();
    }
  }

  private _formatDateRange(): string {
    const { start } = this._timeWindow();
    const lang = this.hass?.locale?.language ?? "en";
    return new Intl.DateTimeFormat(lang, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(start);
  }

  /** Returns axis tick marks with label + fractional position (0–1). */
  private _axisLabels(): { label: string; frac: number }[] {
    const { start, end } = this._timeWindow();
    const totalMs = end.getTime() - start.getTime();
    const fmt = (d: Date): string => {
      const h = d.getHours();
      const m = d.getMinutes();
      return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
    };
    const result: { label: string; frac: number }[] = [];
    // Fixed 6-hour marks that fall within the window
    for (let h = 0; h <= 24; h += 6) {
      const ts = start.getTime() + h * 3_600_000;
      if (ts > end.getTime() + 1) break;
      const frac = Math.min(1, (ts - start.getTime()) / totalMs);
      result.push({ label: h === 0 ? "0h" : fmt(new Date(ts)), frac });
    }
    // For current day, append "now" if it's not already close to the last mark
    if (this._offsetPages === 0) {
      const lastFrac = result[result.length - 1]?.frac ?? 0;
      if (lastFrac < 0.97) {
        result.push({ label: fmt(end), frac: 1 });
      }
    }
    return result;
  }

  private _formatTooltip(startTs: number, endTs: number): string {
    const lang = this.hass?.locale?.language ?? "en";
    const fmtTime = (d: Date) =>
      d.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });
    const durS = Math.round((endTs - startTs) / 1000);
    const durStr =
      durS < 60
        ? `${durS}s`
        : durS < 3600
          ? `${Math.floor(durS / 60)}min${
              durS % 60 > 0 ? " " + (durS % 60) + "s" : ""
            }`
          : `${Math.floor(durS / 3600)}h ${Math.floor((durS % 3600) / 60)}min`;
    return `${fmtTime(new Date(startTs))} – ${fmtTime(new Date(endTs))} (${durStr})`;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  private _onBarEnter(
    ev: ParsedPeriod,
    color: string,
    label: string,
    rowIndex: number,
  ) {
    clearTimeout(this._zoomTimer);
    const eventIndex = this._data[rowIndex]?.indexOf(ev) ?? 0;
    this._zoom = {
      centerTs: (ev.startTs + ev.endTs) / 2,
      highlightStartTs: ev.startTs,
      highlightEndTs: ev.endTs,
      color,
      label,
      rowIndex,
      eventIndex,
    };
  }

  private _zoomNavigate(delta: number) {
    if (!this._zoom) return;
    const events = this._data[this._zoom.rowIndex];
    const newIdx = this._zoom.eventIndex + delta;
    if (newIdx < 0 || newIdx >= events.length) return;
    const ev = events[newIdx];
    this._zoom = {
      ...this._zoom,
      eventIndex: newIdx,
      centerTs: (ev.startTs + ev.endTs) / 2,
      highlightStartTs: ev.startTs,
      highlightEndTs: ev.endTs,
    };
  }

  private _onBarLeave() {
    clearTimeout(this._zoomTimer);
    this._zoomTimer = setTimeout(() => {
      this._zoom = null;
    }, 200) as unknown as ReturnType<typeof setTimeout>;
  }

  private _renderZoom() {
    const zoom = this._zoom!;
    // Adaptive zoom: window = 30× event duration, clamped between 30 min and 120 min.
    // Short events (2s) get a 30-min window; long events (3min) get 120min.
    const evDur = zoom.highlightEndTs - zoom.highlightStartTs;
    const windowMs = Math.max(30 * 60_000, Math.min(120 * 60_000, evDur * 30));
    const zStartTs = zoom.centerTs - windowMs / 2;
    const zEndTs = zoom.centerTs + windowMs / 2;
    const range = windowMs;

    const lang = this.hass?.locale?.language ?? "en";
    const fmtTime = (ts: number) =>
      new Date(ts).toLocaleTimeString(lang, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    const fmtAxis = (ts: number) => {
      const d = new Date(ts);
      const m = d.getMinutes();
      return `${d.getHours()}h${m > 0 ? String(m).padStart(2, "0") : ""}`;
    };

    const durS = Math.round(
      (zoom.highlightEndTs - zoom.highlightStartTs) / 1000,
    );
    const durStr =
      durS < 60
        ? `${durS}s`
        : `${Math.floor(durS / 60)}min${
            durS % 60 ? " " + (durS % 60) + "s" : ""
          }`;

    // Show unlock icon if this event row period overlaps a lock activation
    const OVERLAP_TOLERANCE_MS = 30_000;
    const isUnlockTriggered =
      zoom.rowIndex === 0 &&
      this._lockData.some(
        (lp) =>
          lp.startTs <= zoom.highlightEndTs + OVERLAP_TOLERANCE_MS &&
          lp.endTs >= zoom.highlightStartTs - OVERLAP_TOLERANCE_MS,
      );

    const events = this._data[zoom.rowIndex] ?? [];
    const visible = events.filter(
      (e) => e.endTs >= zStartTs && e.startTs <= zEndTs,
    );

    return html`
      <div
        class="zoom-overlay"
        @mouseenter=${() => clearTimeout(this._zoomTimer)}
        @mouseleave=${this._onBarLeave}
      >
        <div class="zoom-header-info">
          <span class="zoom-time">${fmtTime(zoom.highlightStartTs)}</span>
          <span class="zoom-dur">${durStr}</span>
          ${isUnlockTriggered
            ? html`<ha-icon
                icon="mdi:lock-open-variant"
                class="zoom-unlock-icon"
                title="${localize(this.hass, "history.unlock_triggered")}"
              ></ha-icon>`
            : nothing}
        </div>
        <div class="zoom-header-nav">
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${zoom.eventIndex === 0}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._zoomNavigate(-1);
            }}
            title="Previous event"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${zoom.eventIndex >=
            (this._data[zoom.rowIndex]?.length ?? 0) - 1}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._zoomNavigate(1);
            }}
            title="Next event"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>
        <div class="zoom-track">
          <svg class="zoom-svg" viewBox="0 0 600 28" preserveAspectRatio="none">
            ${visible.map((ev) => {
              const x = Math.max(0, ((ev.startTs - zStartTs) / range) * 600);
              const x2 = Math.min(600, ((ev.endTs - zStartTs) / range) * 600);
              const w = Math.max(4, x2 - x);
              const isHl =
                ev.startTs === zoom.highlightStartTs &&
                ev.endTs === zoom.highlightEndTs;
              return svg`<g>
                <title>${this._formatTooltip(ev.startTs, ev.endTs)}</title>
                <rect
                  x="${x}" y="4" width="${w}" height="20" rx="3"
                  style="fill: ${zoom.color}; stroke: rgba(255,255,255,0.6); stroke-width: 1;"
                  opacity="${isHl ? "1" : "0.35"}"
                />
              </g>`;
            })}
          </svg>
        </div>
        <div class="zoom-axis">
          <span>${fmtAxis(zStartTs)}</span>
          <span>${fmtAxis(zoom.centerTs)}</span>
          <span>${fmtAxis(zEndTs)}</span>
        </div>
      </div>
    `;
  }

  private _renderChart() {
    // Colors: use inline style so CSS custom properties resolve correctly.
    // SVG fill="" attribute does NOT evaluate var(), style="" does.
    const rows: { label: string; color: string; events: ParsedPeriod[] }[] = [
      {
        label: localize(this.hass, "history.row_flap"),
        color: "var(--history-flap-color, #29b6f6)",
        events: this._data[0] ?? [],
      },
      {
        label: localize(this.hass, "history.row_prey"),
        color: "var(--history-contraband-color, #e53935)",
        events: this._data[1] ?? [],
      },
      {
        label: localize(this.hass, "history.row_human"),
        color: "var(--history-human-color, #ab47bc)",
        events: this._data[2] ?? [],
      },
    ];

    return html`
      <div class="history-chart">
        <div class="chart-nav">
          <button
            class="nav-btn"
            @click=${this._navPrev}
            title="Previous period"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <span class="nav-label">${this._formatDateRange()}</span>
          <button
            class="nav-btn"
            @click=${this._navNext}
            ?disabled=${this._offsetPages === 0}
            title="Next period"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>

        <div class="chart-rows">
          ${rows.map(
            (row, rowIndex) => html`
              <div class="chart-row">
                <span class="chart-label" style="color: ${row.color}"
                  >${row.label}</span
                >
                <div class="chart-track">
                  <svg
                    class="chart-svg"
                    viewBox="0 0 600 28"
                    preserveAspectRatio="none"
                    @mouseleave=${this._onBarLeave}
                  >
                    ${row.events.map((ev) => {
                      const x = Math.max(0, ev.start * 600);
                      const w = Math.max(4, (ev.end - ev.start) * 600);
                      return svg`<g
                          class="event-bar"
                          @mouseenter=${(e: MouseEvent) => {
                            e.stopPropagation();
                            this._onBarEnter(
                              ev,
                              row.color,
                              row.label,
                              rowIndex,
                            );
                          }}
                        >
                        <title>${this._formatTooltip(ev.startTs, ev.endTs)}</title>
                        <rect
                          x="${x}"
                          y="4"
                          width="${w}"
                          height="20"
                          rx="3"
                          style="fill: ${row.color}; stroke: rgba(255,255,255,0.5); stroke-width: 0.5;"
                          opacity="0.85"
                        />
                      </g>`;
                    })}
                  </svg>
                </div>
                <span class="chart-count">${row.events.length}</span>
                ${this._zoom?.rowIndex === rowIndex
                  ? this._renderZoom()
                  : nothing}
              </div>
            `,
          )}
        </div>

        <div class="chart-axis">
          <div></div>
          <div class="chart-axis-inner">
            ${this._axisLabels().map(
              ({ label, frac }) =>
                html`<span style="left: ${frac * 100}%">${label}</span>`,
            )}
          </div>
          <div></div>
        </div>
      </div>
    `;
  }

  protected render() {
    const eventOn = this._isEntityOn(this.eventEntityId);
    const contrabandOn = this._isEntityOn(this.contrabandEntityId);
    const humanOn = this._isEntityOn(this.humanEntityId);

    return html`
      <div class="event-section">
        <button
          class="history-toggle ${this._show ? "history-toggle--open" : ""}"
          @click=${this._toggle}
        >
          <ha-icon icon="mdi:chart-timeline-variant"></ha-icon>
          <span>${localize(this.hass, "history.title")}</span>

          ${eventOn
            ? html`<span
                class="event-badge event-badge--flap"
                title="${localize(this.hass, "history.passage_detected")}"
              >
                <ha-icon icon="mdi:cat"></ha-icon>
              </span>`
            : nothing}
          ${contrabandOn
            ? html`<span
                class="event-badge event-badge--contraband"
                title="${localize(this.hass, "history.prey_detected")}"
              >
                <ha-icon icon="mdi:rodent"></ha-icon>
              </span>`
            : nothing}
          ${humanOn
            ? html`<span
                class="event-badge event-badge--human"
                title="${localize(this.hass, "history.human_detected")}"
              >
                <ha-icon icon="mdi:account"></ha-icon>
              </span>`
            : nothing}

          <ha-icon
            class="chevron"
            icon="${this._show ? "mdi:chevron-up" : "mdi:chevron-down"}"
          ></ha-icon>
        </button>

        ${this._show
          ? this._loading && !this._hasFetched
            ? html`<div class="history-status">
                <ha-circular-progress
                  active
                  size="small"
                ></ha-circular-progress>
                <span>${localize(this.hass, "history.loading")}</span>
              </div>`
            : this._error
              ? html`<div class="history-status history-status--error">
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                  <span>${this._error}</span>
                </div>`
              : this._renderChart()
          : nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    /* ── Toggle button ───────────────────────────────── */
    .event-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .history-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 9px 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 9px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      text-align: left;
      transition: border-color 0.15s;
    }

    .history-toggle:hover {
      border-color: var(--primary-color);
    }

    .history-toggle--open {
      border-color: var(--primary-color);
    }

    .history-toggle ha-icon:first-child {
      color: var(--primary-color);
      --mdc-icon-size: 18px;
    }

    .history-toggle span:first-of-type {
      flex: 1;
    }

    .chevron {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }

    /* ── Live event badges ───────────────────────────── */
    .event-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 5px;
      border-radius: 6px;
      font-size: 0;
    }

    .event-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .event-badge--flap {
      background: rgba(41, 182, 246, 0.15);
      color: #29b6f6;
    }

    .event-badge--contraband {
      background: rgba(229, 57, 53, 0.15);
      color: #e53935;
    }

    .event-badge--human {
      background: rgba(171, 71, 188, 0.15);
      color: #ab47bc;
    }

    /* ── Loading / error ─────────────────────────────── */
    .history-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      font-size: 0.875rem;
      color: var(--secondary-text-color);
    }

    .history-status--error {
      color: var(--error-color, #ef5350);
    }

    /* ── Chart container ─────────────────────────────── */
    .history-chart {
      background: var(--secondary-background-color);
      border-radius: 9px;
      padding: 10px 12px 8px;
      animation: fadeSlide 0.2s ease;
    }

    @keyframes fadeSlide {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ── Period navigation ───────────────────────────── */
    .chart-nav {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      transition:
        border-color 0.15s,
        opacity 0.15s;
    }

    .nav-btn:hover:not(:disabled) {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .nav-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }

    .nav-btn ha-icon {
      --mdc-icon-size: 16px;
    }

    .nav-label {
      flex: 1;
      text-align: center;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Timeline rows ───────────────────────────────── */
    .chart-rows {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .chart-row {
      display: grid;
      grid-template-columns: 52px 1fr 28px;
      align-items: center;
      gap: 6px;
      position: relative;
    }

    .chart-label {
      font-size: 0.72rem;
      font-weight: 700;
      text-align: right;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .chart-track {
      height: 28px;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 5px;
      overflow: hidden;
    }

    .chart-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .chart-svg .event-bar {
      cursor: pointer;
    }

    .chart-svg .event-bar:hover rect {
      opacity: 1;
    }

    .chart-count {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-align: center;
    }

    .chart-axis {
      display: grid;
      grid-template-columns: 52px 1fr 28px;
      gap: 6px;
      margin-top: 4px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    .chart-axis-inner {
      position: relative;
      height: 14px;
      overflow: visible;
    }

    .chart-axis-inner span {
      position: absolute;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    /* ── Zoom overlay ────────────────────────────────────── */
    .zoom-overlay {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 58px;
      right: 34px;
      z-index: 10;
      background: var(--card-background-color);
      border: 1px solid var(--primary-color, #6200ea);
      border-radius: 6px;
      padding: 4px 8px 2px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
      pointer-events: auto;
      animation: fadeSlide 0.12s ease;
    }

    .zoom-header-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .zoom-nav-btn {
      width: 22px;
      height: 22px;
      flex-shrink: 0;
    }

    .zoom-nav-btn ha-icon {
      --mdc-icon-size: 14px;
    }

    .zoom-header-info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .zoom-label-title {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .zoom-time {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      background: rgba(41, 182, 246, 0.15);
      padding: 1px 6px;
      border-radius: 8px;
    }

    .zoom-dur {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      padding: 1px 6px;
      border-radius: 8px;
    }

    .zoom-unlock-icon {
      --mdc-icon-size: 14px;
      color: #ff9800;
    }

    .zoom-track {
      height: 28px;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      overflow: hidden;
    }

    .zoom-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .zoom-axis {
      display: flex;
      justify-content: space-between;
      margin-top: 2px;
      font-size: 0.62rem;
      color: var(--secondary-text-color);
      opacity: 0.7;
    }
  `;
}

customElements.define("onlycat-activity-history", OnlyCatActivityHistory);

declare global {
  interface HTMLElementTagNameMap {
    "onlycat-activity-history": OnlyCatActivityHistory;
  }
}
