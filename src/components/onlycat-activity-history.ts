import { LitElement, html, nothing, svg, css } from "lit";
import { property, state } from "lit/decorators.js";
import { localize } from "../localize/localize";
import type { HistoryEntry, HomeAssistant, ParsedPeriod } from "./types";
import { historyPath, parseHistory } from "../utils/history";
import {
  axisTicks,
  dayWindow,
  formatAxisTime,
  formatTime,
  resolveTimeZone,
  useAmPm,
  windowFraction,
  type TimeWindow,
} from "../utils/time";

/** Default number of past days reachable with ◄ (HA recorder keeps 10 days). */
export const DEFAULT_HISTORY_DAYS = 10;

class OnlyCatActivityHistory extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public eventEntityId!: string;
  @property() public contrabandEntityId!: string;
  @property() public humanEntityId!: string;
  @property() public lockEntityId?: string;
  /** How many days back the user may navigate. */
  @property({ type: Number }) public historyDays = DEFAULT_HISTORY_DAYS;

  @state() private _show = false;
  @state() private _loading = false;
  @state() private _hasFetched = false;
  @state() private _error: string | null = null;
  @state() private _data: ParsedPeriod[][] = [[], [], []];
  @state() private _lockData: ParsedPeriod[] = [];
  /** Window the displayed data was fetched for; bars and axis both use it. */
  @state() private _window: TimeWindow | null = null;
  /** 0 = current day, 1 = one day back, etc. */
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
  /** Incremented on every fetch: a response for an older request is dropped. */
  private _requestId = 0;

  // ── Time window ───────────────────────────────────────────────────────────

  private get _timeZone(): string {
    return resolveTimeZone(this.hass);
  }

  private get _amPm(): boolean {
    return useAmPm(this.hass?.locale);
  }

  private get _lang(): string {
    return this.hass?.locale?.language ?? "en";
  }

  /** Window of the page currently selected (may still be loading). */
  private _targetWindow(): TimeWindow {
    return dayWindow(Date.now(), this._offsetPages, this._timeZone);
  }

  private _isEntityOn(id: string): boolean {
    return this.hass?.states?.[id]?.state === "on";
  }

  // ── History loading ───────────────────────────────────────────────────────

  private async _load() {
    const requestId = ++this._requestId;
    const win = this._targetWindow();
    this._loading = true;
    this._error = null;
    try {
      // Rows 0–2 (event, contraband, human) then the lock sensor; entities
      // that could not be resolved are left out of the query.
      const ids = [
        this.eventEntityId,
        this.contrabandEntityId,
        this.humanEntityId,
        this.lockEntityId ?? "",
      ];
      const queried = ids.filter((id) => !!id);
      const raw = queried.length
        ? await this.hass.callApi<HistoryEntry[][]>(
            "GET",
            historyPath(queried, win.start, win.end),
          )
        : [];
      if (requestId !== this._requestId) return;

      const result = parseHistory(raw, ids, win.end);
      this._data = [result[0], result[1], result[2]];
      this._lockData = result[3];
      this._window = win;
      this._zoom = null;
      this._hasFetched = true;
    } catch (e) {
      if (requestId !== this._requestId) return;
      console.error("[OnlyCat] history error", e);
      this._error = localize(this.hass, "history.error");
    } finally {
      if (requestId === this._requestId) this._loading = false;
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  private _toggle() {
    this._show = !this._show;
    if (this._show) this._load();
  }

  private _navPrev() {
    if (this._loading || this._offsetPages >= this.historyDays) return;
    this._offsetPages++;
    this._load();
  }

  private _navNext() {
    if (this._loading || this._offsetPages === 0) return;
    this._offsetPages--;
    this._load();
  }

  private _formatDateRange(): string {
    const { start, timeZone } = this._targetWindow();
    return new Intl.DateTimeFormat(this._lang, {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(start));
  }

  private _formatTooltip(startTs: number, endTs: number): string {
    const fmtTime = (ts: number) =>
      formatTime(ts, this._timeZone, this._lang, this._amPm);
    const durS = Math.round((endTs - startTs) / 1000);
    const durStr =
      durS < 60
        ? `${durS}s`
        : durS < 3600
          ? `${Math.floor(durS / 60)}min${
              durS % 60 > 0 ? " " + (durS % 60) + "s" : ""
            }`
          : `${Math.floor(durS / 3600)}h ${Math.floor((durS % 3600) / 60)}min`;
    return `${fmtTime(startTs)} – ${fmtTime(endTs)} (${durStr})`;
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

    const fmtTime = (ts: number) =>
      formatTime(ts, this._timeZone, this._lang, this._amPm, true);
    const fmtAxis = (ts: number) =>
      formatAxisTime(ts, this._timeZone, this._amPm);

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

  private _renderChart(win: TimeWindow) {
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
            ?disabled=${this._loading || this._offsetPages >= this.historyDays}
            title="Previous period"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <span class="nav-label">${this._formatDateRange()}</span>
          <button
            class="nav-btn"
            @click=${this._navNext}
            ?disabled=${this._loading || this._offsetPages === 0}
            title="Next period"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>

        <div class="chart-rows ${this._loading ? "chart-rows--loading" : ""}">
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
                      const start = windowFraction(win, ev.startTs);
                      const end = windowFraction(win, ev.endTs);
                      const x = start * 600;
                      const w = Math.max(4, (end - start) * 600);
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
            ${axisTicks(win, this._amPm).map(
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
              : this._window
                ? this._renderChart(this._window)
                : nothing
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

    .chart-rows--loading {
      opacity: 0.5;
      transition: opacity 0.15s;
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
