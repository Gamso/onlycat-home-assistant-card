import { LitElement, html, nothing, svg, css } from "lit";
import { property, state } from "lit/decorators.js";
import { localize } from "../localize/localize";
import {
  PASSAGE_COLOR,
  PASSAGE_ICON,
  classifyPassage,
  isAttempt,
  isOutside,
} from "./onlycat-pets";
import type {
  CompressedState,
  ParsedPeriod,
  Passage,
  PassageKind,
  PetInfo,
} from "./types";

/** One line of the timeline. */
interface Row {
  key: string;
  label: string;
  color: string;
  /** Hoverable bars (zoom-navigable). */
  events: (ParsedPeriod | Passage)[];
  /** Pet rows only: periods the pet spent outside, drawn under the bars. */
  background?: ParsedPeriod[];
  /** Bars are flap passages, colored by direction. */
  passages: boolean;
}

const KIND_KEY = {
  in: "history.kind_in",
  out: "history.kind_out",
  in_attempt: "history.kind_in_attempt",
  out_attempt: "history.kind_out_attempt",
  unknown: "history.kind_unknown",
} as const;

class OnlyCatActivityHistory extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @property() public eventEntityId!: string;
  @property() public contrabandEntityId!: string;
  @property() public humanEntityId!: string;
  @property() public lockEntityId?: string;
  @property({ attribute: false }) public pets: PetInfo[] = [];
  @property({ type: Number }) public historyHours = 24;

  @state() private _show = false;
  @state() private _loading = false;
  @state() private _hasFetched = false;
  @state() private _error: string | null = null;
  @state() private _passages: Passage[] = [];
  @state() private _prey: ParsedPeriod[] = [];
  @state() private _human: ParsedPeriod[] = [];
  @state() private _lockData: ParsedPeriod[] = [];
  /** rfid → periods spent outside */
  @state() private _outside: Record<string, ParsedPeriod[]> = {};
  /** 0 = current window, 1 = one window back, etc. */
  @state() private _offsetPages = 0;
  @state() private _zoom: {
    centerTs: number;
    highlightStartTs: number;
    highlightEndTs: number;
    color: string;
    label: string;
    rowKey: string;
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

  /** Time of the last *state* change (ms). `lc` is omitted when == `lu`. */
  private static _ts(e: CompressedState): number {
    return (e.lc ?? e.lu) * 1000;
  }

  /** Turn a state series into the periods during which `isActive` holds. */
  private static _periods(
    series: CompressedState[],
    isActive: (s: string) => boolean,
    startMs: number,
    endMs: number,
  ): ParsedPeriod[] {
    const range = endMs - startMs;
    const result: ParsedPeriod[] = [];
    let since: number | null = null;
    for (const e of series) {
      const ts = Math.max(startMs, OnlyCatActivityHistory._ts(e));
      const active = isActive(e.s);
      if (active && since === null) {
        since = ts;
      } else if (!active && since !== null) {
        result.push({
          start: (since - startMs) / range,
          end: Math.min(1, (ts - startMs) / range),
          startTs: since,
          endTs: ts,
        });
        since = null;
      }
    }
    if (since !== null) {
      result.push({
        start: (since - startMs) / range,
        end: 1,
        startTs: since,
        endTs: endMs,
      });
    }
    return result;
  }

  /**
   * Flap events with their direction and pets.
   *
   * The event sensor turns on when an event starts; the summary (direction,
   * action, rfidCode) arrives as attribute-only updates, sometimes after the
   * sensor is already off, and a later event update can wipe it again. So
   * attributes are merged per `eventId` across every row, keeping the last
   * non-empty value, rather than read off a single state.
   */
  private static _parsePassages(
    series: CompressedState[],
    startMs: number,
    endMs: number,
  ): Passage[] {
    const range = endMs - startMs;
    const out: Passage[] = [];
    const byId = new Map<number, Passage>();
    const summary = new Map<Passage, { direction?: string; action?: string }>();
    let open: Passage | null = null;

    for (const e of series) {
      const ts = Math.max(startMs, OnlyCatActivityHistory._ts(e));
      const a = e.a ?? {};
      const eventId: number | undefined =
        typeof a.eventId === "number" ? a.eventId : undefined;
      const on = e.s === "on";

      const isNewEvent =
        on &&
        (!open ||
          (eventId !== undefined &&
            open.eventId !== undefined &&
            eventId !== open.eventId));
      if (isNewEvent) {
        if (open) open.endTs = ts;
        open = {
          start: 0,
          end: 0,
          startTs: ts,
          endTs: endMs,
          eventId,
          kind: "unknown",
          rfids: [],
        };
        out.push(open);
        summary.set(open, {});
      }

      let target = eventId !== undefined ? byId.get(eventId) : undefined;
      if (!target && on && open) target = open;
      if (target) {
        if (target.eventId === undefined && eventId !== undefined) {
          target.eventId = eventId;
        }
        if (target.eventId !== undefined) byId.set(target.eventId, target);
        const sum = summary.get(target)!;
        if (a.direction) sum.direction = a.direction;
        if (a.action) sum.action = a.action;
        const codes: string[] = [
          ...(a.rfidCode ? [a.rfidCode] : []),
          ...(Array.isArray(a.rfidCodes) ? a.rfidCodes : []),
        ];
        for (const code of codes) {
          const c = String(code).toLowerCase();
          if (!target.rfids.includes(c)) target.rfids.push(c);
        }
      }

      if (!on && open) {
        open.endTs = ts;
        open = null;
      }
    }

    for (const p of out) {
      const sum = summary.get(p)!;
      p.kind = classifyPassage(sum.direction, sum.action);
      p.start = (p.startTs - startMs) / range;
      p.end = Math.min(1, (p.endTs - startMs) / range);
    }
    return out;
  }

  private async _load() {
    if (this._loading) return;
    this._loading = true;
    this._error = null;
    try {
      const { start, end } = this._timeWindow();
      const startMs = start.getTime();
      const endMs = end.getTime();
      const entityIds = [
        this.eventEntityId,
        this.contrabandEntityId,
        this.humanEntityId,
        ...(this.lockEntityId ? [this.lockEntityId] : []),
        ...this.pets.map((p) => p.entityId),
      ];

      // Websocket history keeps attributes (eventId, direction, rfidCode…),
      // which the REST `no_attributes` query used to drop.
      const raw = (await this.hass.callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: entityIds,
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: false,
        no_attributes: false,
      })) as Record<string, CompressedState[]>;

      const series = (id?: string) => (id && raw?.[id]) || [];
      const isOn = (s: string) => s === "on";

      this._passages = OnlyCatActivityHistory._parsePassages(
        series(this.eventEntityId),
        startMs,
        endMs,
      );
      this._prey = OnlyCatActivityHistory._periods(
        series(this.contrabandEntityId),
        isOn,
        startMs,
        endMs,
      );
      this._human = OnlyCatActivityHistory._periods(
        series(this.humanEntityId),
        isOn,
        startMs,
        endMs,
      );
      this._lockData = OnlyCatActivityHistory._periods(
        series(this.lockEntityId),
        isOn,
        startMs,
        endMs,
      );
      const outside: Record<string, ParsedPeriod[]> = {};
      for (const pet of this.pets) {
        outside[pet.rfid] = OnlyCatActivityHistory._periods(
          series(pet.entityId),
          isOutside,
          startMs,
          endMs,
        );
      }
      this._outside = outside;

      console.debug(
        "[OnlyCat] history parsed",
        `passages:${this._passages.length}`,
        `prey:${this._prey.length}`,
        `human:${this._human.length}`,
        this._passages.map(
          (p) =>
            `${new Date(p.startTs).toISOString()} #${p.eventId ?? "?"} ${p.kind} [${p.rfids.join(",")}]`,
        ),
      );
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
    this._zoom = null;
    this._load();
  }

  private _navNext() {
    if (this._offsetPages > 0) {
      this._offsetPages--;
      this._zoom = null;
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

  private _kindLabel(kind: PassageKind): string {
    return localize(this.hass, KIND_KEY[kind]);
  }

  /** Pet names for a passage's RFID codes; unknown chips show as such. */
  private _petNames(p: Passage): string[] {
    return p.rfids.map(
      (rfid) =>
        this.pets.find((pet) => pet.rfid === rfid)?.name ??
        localize(this.hass, "history.unknown_pet"),
    );
  }

  private _passageTooltip(p: Passage): string {
    return [
      this._formatTooltip(p.startTs, p.endTs),
      this._kindLabel(p.kind),
      ...this._petNames(p),
    ].join(" · ");
  }

  private static _isPassage(ev: ParsedPeriod | Passage): ev is Passage {
    return "kind" in ev;
  }

  // ── Rows ──────────────────────────────────────────────────────────────────

  private _rows(): Row[] {
    // Colors: use inline style so CSS custom properties resolve correctly.
    // SVG fill="" attribute does NOT evaluate var(), style="" does.
    const petRows: Row[] = this.pets.map((pet) => ({
      key: `pet:${pet.rfid}`,
      label: pet.name,
      color: pet.color,
      events: this._passages.filter((p) => p.rfids.includes(pet.rfid)),
      background: this._outside[pet.rfid] ?? [],
      passages: true,
    }));
    return [
      {
        key: "flap",
        label: localize(this.hass, "history.row_flap"),
        color: "var(--history-flap-color, #29b6f6)",
        events: this._passages,
        passages: true,
      },
      ...petRows,
      {
        key: "prey",
        label: localize(this.hass, "history.row_prey"),
        color: "var(--history-contraband-color, #e53935)",
        events: this._prey,
        passages: false,
      },
      {
        key: "human",
        label: localize(this.hass, "history.row_human"),
        color: "var(--history-human-color, #ab47bc)",
        events: this._human,
        passages: false,
      },
    ];
  }

  // ── Render ────────────────────────────────────────────────────────────────

  private _onBarEnter(row: Row, ev: ParsedPeriod | Passage) {
    clearTimeout(this._zoomTimer);
    this._zoom = {
      centerTs: (ev.startTs + ev.endTs) / 2,
      highlightStartTs: ev.startTs,
      highlightEndTs: ev.endTs,
      color: row.color,
      label: row.label,
      rowKey: row.key,
      eventIndex: row.events.indexOf(ev),
    };
  }

  private _zoomNavigate(delta: number) {
    if (!this._zoom) return;
    const events =
      this._rows().find((r) => r.key === this._zoom!.rowKey)?.events ?? [];
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

  /**
   * One timeline bar. Passages take their direction's color; attempts that
   * didn't cross the flap are hollow with a dashed outline.
   */
  private _renderBar(
    row: Row,
    ev: ParsedPeriod | Passage,
    x: number,
    w: number,
    opacity: string,
    interactive: boolean,
  ) {
    const passage = OnlyCatActivityHistory._isPassage(ev) ? ev : null;
    const color = passage ? PASSAGE_COLOR[passage.kind] : row.color;
    const title = passage
      ? this._passageTooltip(passage)
      : this._formatTooltip(ev.startTs, ev.endTs);
    const style =
      passage && isAttempt(passage.kind)
        ? `fill: ${color}; fill-opacity: 0.2; stroke: ${color}; stroke-width: 1.5; stroke-dasharray: 3 2;`
        : `fill: ${color}; stroke: rgba(255,255,255,0.5); stroke-width: 0.5;`;
    return svg`<g
        class="event-bar"
        @mouseenter=${interactive
          ? (e: MouseEvent) => {
              e.stopPropagation();
              this._onBarEnter(row, ev);
            }
          : null}
      >
      <title>${title}</title>
      <rect x="${x}" y="4" width="${w}" height="20" rx="3"
        style="${style}" opacity="${opacity}" />
    </g>`;
  }

  /** Pet rows: the periods spent outside, as a thin band under the bars. */
  private _renderOutside(
    row: Row,
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

  private _renderZoom(row: Row) {
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

    // Show unlock icon if this passage overlaps a lock activation
    const OVERLAP_TOLERANCE_MS = 30_000;
    const isUnlockTriggered =
      row.passages &&
      this._lockData.some(
        (lp) =>
          lp.startTs <= zoom.highlightEndTs + OVERLAP_TOLERANCE_MS &&
          lp.endTs >= zoom.highlightStartTs - OVERLAP_TOLERANCE_MS,
      );

    const events = row.events;
    const current = events[zoom.eventIndex];
    const passage =
      current && OnlyCatActivityHistory._isPassage(current) ? current : null;
    const names = passage ? this._petNames(passage) : [];
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
            title="Previous event"
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
            title="Next event"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
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
    const hasDirection = this._passages.some((p) => p.kind !== "unknown");
    const hasAttempt = this._passages.some((p) => isAttempt(p.kind));
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
                  ></span>
                  ${this._kindLabel(k)}
                </span>`,
            )
          : nothing}
        ${hasAttempt
          ? html`<span class="legend-item">
              <span class="legend-swatch legend-swatch--attempt"></span>
              ${localize(this.hass, "history.attempt")}
            </span>`
          : nothing}
        ${this.pets.length
          ? html`<span class="legend-item">
              <span class="legend-swatch legend-swatch--outside"></span>
              ${localize(this.hass, "history.outside")}
            </span>`
          : nothing}
      </div>
    `;
  }

  private _renderChart() {
    const rows = this._rows();

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
                    @mouseleave=${this._onBarLeave}
                  >
                    ${this._renderOutside(row, (b) => [
                      b.start * 600,
                      b.end * 600,
                    ])}
                    ${row.events.map((ev) =>
                      this._renderBar(
                        row,
                        ev,
                        Math.max(0, ev.start * 600),
                        Math.max(4, (ev.end - ev.start) * 600),
                        "0.85",
                        true,
                      ),
                    )}
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
            ${this._axisLabels().map(
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
