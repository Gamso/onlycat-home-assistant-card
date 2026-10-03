import { LitElement, html, nothing, css } from "lit";
import { property } from "lit/decorators.js";
import { localize } from "../localize/localize";
import { formatRelativeTime, safeCameraUrl } from "../utils/camera";
import {
  PASSAGE_COLOR,
  PASSAGE_ICON,
  classifyPassage,
  isAttempt,
} from "./onlycat-pets";
import type { HomeAssistant, PetInfo } from "./types";

class OnlyCatCameraPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public entityId!: string;

  @property() public eventEntityId?: string;
  @property() public humanEntityId?: string;
  @property() public contrabandEntityId?: string;
  @property() public lastActivityEntityId?: string;
  @property({ attribute: false }) public pets: PetInfo[] = [];

  /** Direction and pet of the latest passage, from the event summary. */
  private _renderLastPassage() {
    const a = this.eventEntityId
      ? this.hass?.states?.[this.eventEntityId]?.attributes
      : undefined;
    const kind = classifyPassage(
      a?.direction as string | undefined,
      a?.action as string | undefined,
    );
    if (kind === "unknown") return nothing;
    const rfid = a?.rfidCode ? String(a.rfidCode).toLowerCase() : undefined;
    const pet = this.pets.find((p) => p.rfid === rfid)?.name;
    // Like the timeline, say nothing about a passage no known cat made.
    if (this.pets.length && !pet) return nothing;
    const kindKey = `history.kind_${kind}` as const;
    return html`<span
      class="camera-passage ${isAttempt(kind) ? "camera-passage--attempt" : ""}"
      style="--passage-color: ${PASSAGE_COLOR[kind]}"
    >
      <ha-icon icon="${PASSAGE_ICON[kind]}"></ha-icon>
      ${localize(this.hass, kindKey)}${pet ? html` · ${pet}` : nothing}
    </span>`;
  }

  /** Re-renders every minute so the "x min ago" label stays current. */
  private _clockTimer?: ReturnType<typeof setInterval>;

  connectedCallback(): void {
    super.connectedCallback();
    this._clockTimer = setInterval(() => this.requestUpdate(), 60_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this._clockTimer);
  }

  private _entity() {
    return this.hass?.states?.[this.entityId];
  }

  /**
   * HA sets `entity_picture` on every camera entity automatically: a relative
   * URL (/api/camera_proxy/…?token=…) resolved against the HA origin, with a
   * token HA renews. Anything else is ignored (see safeCameraUrl).
   */
  private _getSnapshotUrl(): string | null {
    return safeCameraUrl(this._entity()?.attributes?.entity_picture);
  }

  /** Open the HA built-in more-info dialog for the camera entity (shows the HLS video stream). */
  private _openMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId: this.entityId },
      }),
    );
  }

  /**
   * Returns the timestamp (ms) of the most recent activity.
   * Priority:
   *   1. last activity image entity: an image entity's state is the ISO time
   *      of its last image ("unavailable"/"unknown" fall through);
   *   2. last change of the event, human, contraband sensors.
   */
  private _latestActivityTs(): number | null {
    if (this.lastActivityEntityId) {
      const state = this.hass?.states?.[this.lastActivityEntityId]?.state;
      const ms = state ? new Date(state).getTime() : NaN;
      if (!isNaN(ms)) return ms;
    }
    // 2. Fallback to event, human, contraband sensors
    const ids = [
      this.eventEntityId,
      this.humanEntityId,
      this.contrabandEntityId,
    ];
    let latest: number | null = null;
    for (const id of ids) {
      if (!id) continue;
      const lc = this.hass?.states?.[id]?.last_changed;
      if (!lc) continue;
      const ms = new Date(lc).getTime();
      if (!isNaN(ms) && (latest === null || ms > latest)) {
        latest = ms;
      }
    }
    return latest;
  }

  private _onKeyDown(ev: KeyboardEvent) {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      this._openMoreInfo();
    }
  }

  protected render() {
    const imgUrl = this._getSnapshotUrl();
    const lastActivityTs = this._latestActivityTs();
    const unavailable = this._entity()?.state === "unavailable";

    return html`
      <div
        class="camera-panel ${imgUrl ? "camera-panel--clickable" : ""}"
        role=${imgUrl ? "button" : nothing}
        tabindex=${imgUrl ? "0" : nothing}
        aria-label=${imgUrl ? localize(this.hass, "camera.open") : nothing}
        @click=${() => {
          if (imgUrl) this._openMoreInfo();
        }}
        @keydown=${(ev: KeyboardEvent) => {
          if (imgUrl) this._onKeyDown(ev);
        }}
      >
        ${imgUrl
          ? html`
              <img
                src="${imgUrl}"
                alt="${localize(this.hass, "camera.title")}"
                class="camera-img"
              />
              <div class="camera-overlay">
                <ha-icon icon="mdi:play-circle-outline"></ha-icon>
                ${lastActivityTs !== null
                  ? html`<span class="camera-ts"
                      >${formatRelativeTime(
                        this.hass,
                        lastActivityTs,
                        Date.now(),
                      )}</span
                    >`
                  : nothing}
                ${this._renderLastPassage()}
              </div>
            `
          : html`
              <div class="camera-placeholder">
                <ha-icon
                  icon=${unavailable ? "mdi:video-off-outline" : "mdi:paw"}
                ></ha-icon>
                <span
                  >${unavailable
                    ? localize(this.hass, "camera.stream_unavailable")
                    : localize(this.hass, "card.no_recent_activity")}</span
                >
              </div>
            `}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    /* ── Thumbnail ───────────────────────────────────── */
    .camera-panel {
      position: relative;
      height: 160px;
      border-radius: 10px;
      overflow: hidden;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .camera-panel--clickable {
      cursor: pointer;
    }

    .camera-panel--clickable:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .camera-panel--clickable:hover .camera-overlay,
    .camera-panel--clickable:focus-visible .camera-overlay {
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
    }

    .camera-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .camera-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent 40%, rgba(0, 0, 0, 0.55));
      display: flex;
      align-items: flex-end;
      gap: 6px;
      padding: 10px 12px;
      color: #fff;
      transition: background 0.2s;
    }

    .camera-overlay ha-icon {
      --mdc-icon-size: 22px;
    }

    .camera-ts {
      font-size: 0.8rem;
    }

    .camera-passage {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px 2px 6px;
      border-radius: 99px;
      background: var(--passage-color);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .camera-passage ha-icon {
      --mdc-icon-size: 15px;
    }

    .camera-passage--attempt {
      background: rgba(0, 0, 0, 0.45);
      border: 1.5px dashed var(--passage-color);
    }

    .camera-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: var(--secondary-text-color);
      opacity: 0.5;
    }

    .camera-placeholder ha-icon {
      --mdc-icon-size: 52px;
    }

    .camera-placeholder span {
      font-size: 0.85rem;
    }
  `;
}

customElements.define("onlycat-camera-panel", OnlyCatCameraPanel);

declare global {
  interface HTMLElementTagNameMap {
    "onlycat-camera-panel": OnlyCatCameraPanel;
  }
}
