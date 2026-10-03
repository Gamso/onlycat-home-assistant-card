import { LitElement, html, nothing, svg, css } from "lit";
import { property, state } from "lit/decorators.js";
import { localize } from "../localize/localize";
import {
  PASSAGE_COLOR,
  PASSAGE_ICON,
  isAttempt,
  isOutside,
} from "./onlycat-pets";
import type {
  HomeAssistant,
  ParsedPeriod,
  Passage,
  PassageKind,
  PetInfo,
} from "./types";
import {
  EMPTY_TIMELINE,
  historyMessage,
  isPassage,
  knownCatPassages,
  parseTimeline,
  timelineRows,
  type HistoryResponse,
  type TimelineData,
  type TimelineRow,
} from "../utils/history";
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

const KIND_KEY = {
  in: "history.kind_in",
  out: "history.kind_out",
  in_attempt: "history.kind_in_attempt",
  out_attempt: "history.kind_out_attempt",
  unknown: "history.kind_unknown",
} as const;

type TimelineEvent = ParsedPeriod | Passage;

class OnlyCatActivityHistory extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public eventEntityId!: string;
  @property() public contrabandEntityId!: string;
  @property() public humanEntityId!: string;
  @property() public lockEntityId?: string;
  @property({ attribute: false }) public pets: PetInfo[] = [];
  /** How many days back the user may navigate. */
  @property({ type: Number }) public historyDays = DEFAULT_HISTORY_DAYS;

  @state() private _show = false;
  @state() private _loading = false;
  @state() private _hasFetched = false;
  @state() private _error: string | null = null;
  @state() private _data: TimelineData = EMPTY_TIMELINE;
  /** Window the displayed data was fetched for; bars and axis both use it. */
  @state() private _window: TimeWindow | null = null;
  /** 0 = current day, 1 = one day back, etc. */
  @state() private _offsetPages = 0;
  @state() private _zoom: {
    centerTs: number;
    highlightStartTs: number;
    highlightEndTs: number;
    rowKey: string;
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
    // Pets are read when the request starts: the response is parsed against
    // the trackers it was asked for.
    const pets = this.pets;
    this._loading = true;
    this._error = null;
    try {
      // Entities that could not be resolved are left out of the query.
      const ids = {
        event: this.eventEntityId,
        contraband: this.contrabandEntityId,
        human: this.humanEntityId,
        lock: this.lockEntityId,
      };
      const queried = [
        ...Object.values(ids),
        ...pets.map((p) => p.entityId),
      ].filter((id): id is string => !!id);
      const raw = queried.length
        ? await this.hass.callWS<HistoryResponse>(
            historyMessage(queried, win.start, win.end),
          )
        : {};
      if (requestId !== this._requestId) return;

      this._data = parseTimeline(
        raw,
        ids,
        pets,
        isOutside,
        win.start,
        win.end,
      );
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

  private _kindLabel(kind: PassageKind): string {
    return localize(this.hass, KIND_KEY[kind]);
  }

  /** Names of the known cats in a passage; visitors aren't named. */
  private _petNames(p: Passage): string[] {
    return this.pets
      .filter((pet) => p.rfids.includes(pet.rfid))
      .map((pet) => pet.name);
  }

  private _passageTooltip(p: Passage): string {
    return [
      this._formatTooltip(p.startTs, p.endTs),
      this._kindLabel(p.kind),
      ...this._petNames(p),
    ].join(" · ");
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._zoomTimer);
  }

  // ── Rows ──────────────────────────────────────────────────────────────────

  private _rows(): TimelineRow[] {
    // Colors: use inline style so CSS custom properties resolve correctly.
    // SVG fill="" attribute does NOT evaluate var(), style="" does.
    return timelineRows(this._data, this.pets, {
      flap: {
        label: localize(this.hass, "history.row_flap"),
        color: "var(--oc-flap-color)",
      },
      prey: {
        label: localize(this.hass, "history.row_prey"),
        color: "var(--oc-contraband-color)",
      },
      human: {
        label: localize(this.hass, "history.row_human"),
        color: "var(--oc-human-color)",
      },
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  //
  // Loading indicator: ha-spinner replaced ha-circular-progress in the HA
  // frontend (2025.4); the latter no longer exists in current releases but is
  // kept for older ones.

  private _onBarEnter(row: TimelineRow, ev: TimelineEvent) {
    clearTimeout(this._zoomTimer);
    this._zoom = {
      centerTs: (ev.startTs + ev.endTs) / 2,
      highlightStartTs: ev.startTs,
      highlightEndTs: ev.endTs,
      rowKey: row.key,
      eventIndex: Math.max(0, row.events.indexOf(ev)),
    };
  }

  private _zoomNavigate(delta: number) {
    if (!this._zoom) return;
    const rowKey = this._zoom.rowKey;
    const events = this._rows().find((r) => r.key === rowKey)?.events ?? [];
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
    }, 200);
  }

  // Hover opens the zoom with a mouse only: on touch screens (companion app)
  // the emulated mouseenter fired by a tap is never followed by mouseleave.
  // A tap (or click) on a bar toggles the zoom instead; the zoom has a close
  // button.

  private _onBarPointerEnter(
    e: PointerEvent,
    row: TimelineRow,
    ev: TimelineEvent,
  ) {
    if (e.pointerType !== "mouse") return;
    e.stopPropagation();
    this._onBarEnter(row, ev);
  }

  private _onBarClick(e: Event, row: TimelineRow, ev: TimelineEvent) {
    e.stopPropagation();
    const isMouse = (e as PointerEvent).pointerType === "mouse";
    const sameBar =
      this._zoom?.rowKey === row.key &&
      this._zoom.highlightStartTs === ev.startTs &&
      this._zoom.highlightEndTs === ev.endTs;
    if (sameBar && !isMouse) {
      this._closeZoom();
    } else {
      this._onBarEnter(row, ev);
    }
  }

  private _onPointerLeave(e: PointerEvent) {
    if (e.pointerType === "mouse") this._onBarLeave();
  }

  private _closeZoom() {
    clearTimeout(this._zoomTimer);
    this._zoom = null;
  }

  /**
   * One timeline bar. Passages take their direction's color; attempts that
   * didn't cross the flap are hollow with a dashed outline.
   */
  private _renderBar(
    row: TimelineRow,
    ev: TimelineEvent,
    x: number,
    w: number,
    opacity: string,
    interactive: boolean,
  ) {
    const passage = isPassage(ev) ? ev : null;
    const color = passage ? PASSAGE_COLOR[passage.kind] : row.color;
    const title = passage
      ? this._passageTooltip(passage)
      : this._formatTooltip(ev.startTs, ev.endTs);
    const style =
      passage && isAttempt(passage.kind)
        ? `fill: ${color}; fill-opacity: 0.2; stroke: ${color}; stroke-width: 1.5; stroke-dasharray: 3 2;`
        : `fill: ${color}; stroke: var(--card-background-color, #fff); stroke-opacity: 0.5; stroke-width: 0.5;`;
    return svg`<g
        class="event-bar"
        @pointerenter=${interactive
          ? (e: PointerEvent) => this._onBarPointerEnter(e, row, ev)
          : null}
        @click=${interactive ? (e: Event) => this._onBarClick(e, row, ev) : null}
      >
      <title>${title}</title>
      <rect x="${x}" y="4" width="${w}" height="20" rx="3"
        style="${style}" opacity="${opacity}" />
    </g>`;
  }

  /** Pet rows: the periods spent outside, as a thin band under the bars. */
  private _renderOutside(
    row: TimelineRow,
    toX: (p: ParsedPeriod) => [number, number],
  ) {
    const label = localize(this.hass, "history.outside");
    return (row.background ?? []).map((b) => {
      const [x, x2] = toX(b);
      return svg`<g>
        <title>${label} ${this._formatTooltip(b.startTs, b.endTs)}</title>
        <rect x="${x}" y="9" width="${Math.max(1, x2 - x)}" height="10"
          rx="2" class="outside-bar" style="fill: ${row.color};" />
      </g>`;
    });
  }

  private _renderZoom(row: TimelineRow) {
    const zoom = this._zoom!;
    // Adaptive zoom: window = 30× event duration, clamped between 30 min and 120 min.
    // Short events (2s) get a 30-min window; long events (3min) get 120min.
    const evDur = zoom.highlightEndTs - zoom.highlightStartTs;
    const windowMs = Math.max(30 * 60_000, Math.min(120 * 60_000, evDur * 30));
    const zStartTs = zoom.centerTs - windowMs / 2;
    const zEndTs = zoom.centerTs + windowMs / 2;
    const range = windowMs;
    const toX = (ts: number) =>
      Math.min(600, Math.max(0, ((ts - zStartTs) / range) * 600));

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

    // Show unlock icon if this passage overlaps a lock activation
    const OVERLAP_TOLERANCE_MS = 30_000;
    const isUnlockTriggered =
      row.passages &&
      this._data.lock.some(
        (lp) =>
          lp.startTs <= zoom.highlightEndTs + OVERLAP_TOLERANCE_MS &&
          lp.endTs >= zoom.highlightStartTs - OVERLAP_TOLERANCE_MS,
      );

    const events = row.events;
    const current = events[zoom.eventIndex];
    const passage = current && isPassage(current) ? current : null;
    const names = passage ? this._petNames(passage) : [];
    const visible = events.filter(
      (e) => e.endTs >= zStartTs && e.startTs <= zEndTs,
    );

    return html`
      <div
        class="zoom-overlay"
        @pointerenter=${() => clearTimeout(this._zoomTimer)}
        @pointerleave=${this._onPointerLeave}
      >
        <div class="zoom-header-info">
          <span class="zoom-time">${fmtTime(zoom.highlightStartTs)}</span>
          <span class="zoom-dur">${durStr}</span>
          ${passage && passage.kind !== "unknown"
            ? html`<span
                class="zoom-kind"
                style="color: ${PASSAGE_COLOR[passage.kind]}"
              >
                <ha-icon icon="${PASSAGE_ICON[passage.kind]}"></ha-icon>
                ${this._kindLabel(passage.kind)}
              </span>`
            : nothing}
          ${names.length
            ? html`<span class="zoom-pets">${names.join(", ")}</span>`
            : nothing}
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
            title="${localize(this.hass, "history.previous_event")}"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${zoom.eventIndex >= events.length - 1}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._zoomNavigate(1);
            }}
            title="${localize(this.hass, "history.next_event")}"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <button
            class="nav-btn zoom-nav-btn zoom-close-btn"
            @click=${(e: Event) => {
              e.stopPropagation();
              this._closeZoom();
            }}
            title="${localize(this.hass, "history.close_zoom")}"
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="zoom-track">
          <svg class="zoom-svg" viewBox="0 0 600 28" preserveAspectRatio="none">
            ${this._renderOutside(row, (b) => [toX(b.startTs), toX(b.endTs)])}
            ${visible.map((ev) => {
              const x = toX(ev.startTs);
              const w = Math.max(4, toX(ev.endTs) - x);
              const isHl =
                ev.startTs === zoom.highlightStartTs &&
                ev.endTs === zoom.highlightEndTs;
              return this._renderBar(row, ev, x, w, isHl ? "1" : "0.35", false);
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

  private _renderLegend() {
    const passages = knownCatPassages(this._data.passages, this.pets);
    const hasDirection = passages.some((p) => p.kind !== "unknown");
    const hasAttempt = passages.some((p) => isAttempt(p.kind));
    if (!hasDirection && !this.pets.length) return nothing;
    return html`
      <div class="chart-legend">
        ${hasDirection
          ? (["in", "out"] as PassageKind[]).map(
              (k) =>
                html`<span class="legend-item">
                  <span
                    class="legend-swatch"
                    style="background: ${PASSAGE_COLOR[k]}"
                    aria-hidden="true"
                  ></span>
                  ${this._kindLabel(k)}
                </span>`,
            )
          : nothing}
        ${hasAttempt
          ? html`<span class="legend-item">
              <span
                class="legend-swatch legend-swatch--attempt"
                aria-hidden="true"
              ></span>
              ${localize(this.hass, "history.attempt")}
            </span>`
          : nothing}
        ${this.pets.length
          ? html`<span class="legend-item">
              <span
                class="legend-swatch legend-swatch--outside"
                aria-hidden="true"
              ></span>
              ${localize(this.hass, "history.outside")}
            </span>`
          : nothing}
      </div>
    `;
  }

  private _renderChart(win: TimeWindow) {
    const rows = this._rows();
    const toX = (b: ParsedPeriod): [number, number] => [
      windowFraction(win, b.startTs) * 600,
      windowFraction(win, b.endTs) * 600,
    ];

    return html`
      <div class="history-chart">
        <div class="chart-nav">
          <button
            class="nav-btn"
            @click=${this._navPrev}
            ?disabled=${this._loading || this._offsetPages >= this.historyDays}
            title="${localize(this.hass, "history.previous_day")}"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <span class="nav-label">${this._formatDateRange()}</span>
          <button
            class="nav-btn"
            @click=${this._navNext}
            ?disabled=${this._loading || this._offsetPages === 0}
            title="${localize(this.hass, "history.next_day")}"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>

        <div class="chart-rows ${this._loading ? "chart-rows--loading" : ""}">
          ${rows.map(
            (row) => html`
              <div class="chart-row">
                <span
                  class="chart-label"
                  style="color: ${row.color}"
                  title="${row.label}"
                  >${row.label}</span
                >
                <div class="chart-track">
                  <svg
                    class="chart-svg"
                    viewBox="0 0 600 28"
                    preserveAspectRatio="none"
                    @pointerleave=${this._onPointerLeave}
                  >
                    ${this._renderOutside(row, toX)}
                    ${row.events.map((ev) => {
                      const [x, x2] = toX(ev);
                      return this._renderBar(
                        row,
                        ev,
                        x,
                        Math.max(4, x2 - x),
                        "0.85",
                        true,
                      );
                    })}
                  </svg>
                </div>
                <span class="chart-count">${row.events.length}</span>
                ${this._zoom?.rowKey === row.key
                  ? this._renderZoom(row)
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
        ${this._renderLegend()}
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
                ${customElements.get("ha-spinner")
                  ? html`<ha-spinner size="small"></ha-spinner>`
                  : html`<ha-circular-progress
                      active
                      indeterminate
                      size="small"
                    ></ha-circular-progress>`}
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
      /* Theme colours; --history-*-color stay available as overrides. */
      --oc-flap-color: var(--history-flap-color, var(--info-color, #039be5));
      --oc-contraband-color: var(
        --history-contraband-color,
        var(--error-color, #db4437)
      );
      --oc-human-color: var(--history-human-color, var(--purple-color, #926bc7));
      --oc-track-color: color-mix(
        in srgb,
        var(--primary-text-color, #212121) 8%,
        transparent
      );
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
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--oc-flap-color) 15%, transparent);
      color: var(--oc-flap-color);
    }

    .event-badge--contraband {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--oc-contraband-color) 15%, transparent);
      color: var(--oc-contraband-color);
    }

    .event-badge--human {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--oc-human-color) 15%, transparent);
      color: var(--oc-human-color);
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
      grid-template-columns: 64px 1fr 28px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .outside-bar {
      opacity: 0.28;
    }

    .chart-track {
      height: 28px;
      background: var(--oc-track-color);
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
      grid-template-columns: 64px 1fr 28px;
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
      left: 70px;
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
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--oc-flap-color) 15%, transparent);
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
      color: var(--warning-color, #ff9800);
    }

    .zoom-track {
      height: 28px;
      background: var(--oc-track-color);
      border-radius: 4px;
      overflow: hidden;
    }

    .zoom-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .zoom-kind {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .zoom-kind ha-icon {
      --mdc-icon-size: 14px;
    }

    .zoom-pets {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .zoom-axis {
      display: flex;
      justify-content: space-between;
      margin-top: 2px;
      font-size: 0.62rem;
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    /* ── Legend ──────────────────────────────────────────── */
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px 12px;
      margin-top: 6px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .legend-swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .legend-swatch--attempt {
      border: 1.5px dashed var(--secondary-text-color);
      box-sizing: border-box;
    }

    .legend-swatch--outside {
      height: 5px;
      background: var(--secondary-text-color);
      opacity: 0.4;
    }
  `;
}

customElements.define("onlycat-activity-history", OnlyCatActivityHistory);

declare global {
  interface HTMLElementTagNameMap {
    "onlycat-activity-history": OnlyCatActivityHistory;
  }
}
