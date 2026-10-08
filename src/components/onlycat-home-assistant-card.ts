import { LitElement, html, nothing, css } from "lit";
import { property, query, state } from "lit/decorators.js";
import "./onlycat-home-assistant-card-editor";
import "./onlycat-camera-panel";
import { DEFAULT_HISTORY_DAYS } from "./onlycat-activity-history";
import "./onlycat-pet-status";
import { discoverPets } from "./onlycat-pets";
import { localize } from "../localize/localize";
import type { HomeAssistant, OnlyCatCardConfig, PetInfo } from "./types";
import {
  isConfigured,
  resolveEntities,
  type ResolvedEntities,
} from "../utils/entities";

class OnlyCatHomeAssistantCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: OnlyCatCardConfig;

  @query("dialog.reboot-dialog") private _rebootDialog?: HTMLDialogElement;
  @query(".action-btn--secondary") private _rebootButton?: HTMLButtonElement;

  /** Entity ids resolved for the current render (see utils/entities). */
  private _ids: ResolvedEntities = resolveEntities(undefined, {});

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  public static getStubConfig(): OnlyCatCardConfig {
    return {
      name: "",
      device: "",
      show_title: true,
    };
  }

  public static getConfigElement() {
    return document.createElement("onlycat-home-assistant-card-editor");
  }

  public setConfig(config: OnlyCatCardConfig): void {
    if (!config) throw new Error("Invalid configuration.");
    this._config = {
      name: config.name ?? "",
      device: config.device ?? "",
      device_id: config.device_id ?? "",
      show_title: config.show_title !== false,
      show_pets: config.show_pets !== false,
      ...(config.entities ? { entities: { ...config.entities } } : {}),
      ...(config.history_days !== undefined
        ? { history_days: config.history_days }
        : {}),
      ...(config.pets ? { pets: config.pets } : {}),
    };
  }

  /**
   * Height in 50 px units for the masonry view: the rendered height when the
   * card is laid out (it grows when the timeline is unfolded), otherwise an
   * estimate of the folded card.
   */
  public getCardSize(): number {
    const height = this.offsetHeight;
    if (height > 0) return Math.ceil(height / 50);
    return this._config?.show_title === false ? 7 : 8;
  }

  /** Sections view: full width by default, height follows the content. */
  public getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" as const };
  }

  // ── State helpers ─────────────────────────────────────────────────────────

  private _petsCache?: { key: string; pets: PetInfo[] };

  /**
   * Pet trackers, memoised on their ids and names so the history component
   * doesn't see a new array (and re-render) on every hass update.
   */
  private get _pets(): PetInfo[] {
    const pets = discoverPets(this.hass, this._config);
    const key = JSON.stringify(pets);
    if (this._petsCache?.key !== key) this._petsCache = { key, pets };
    return this._petsCache.pets;
  }

  private _entity(entityId: string) {
    return this.hass?.states?.[entityId];
  }

  private _isOn(entityId: string): boolean {
    return this._entity(entityId)?.state === "on";
  }

  /** False when the entity is missing, "unavailable" or "unknown". */
  private _isAvailable(entityId: string): boolean {
    const state = this._entity(entityId)?.state;
    return !!state && state !== "unavailable" && state !== "unknown";
  }

  /** "on" / "off" for a usable binary sensor, null otherwise. */
  private _binaryState(entityId: string): "on" | "off" | null {
    const state = this._entity(entityId)?.state;
    return state === "on" || state === "off" ? state : null;
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  private _onUnlock() {
    if (!this._isAvailable(this._ids.unlock)) return;
    this.hass.callService("button", "press", {
      entity_id: this._ids.unlock,
    });
  }

  private _onRebootConfirm() {
    if (!this._isAvailable(this._ids.reboot)) return;
    this.hass.callService("button", "press", {
      entity_id: this._ids.reboot,
    });
    this._closeRebootConfirm();
  }

  private _onPolicyChange(ev: Event) {
    const option = (ev.target as HTMLSelectElement).value;
    if (!option) return;
    this.hass.callService("select", "select_option", {
      entity_id: this._ids.policy,
      option,
    });
  }

  // ── Render helpers ────────────────────────────────────────────────────────

  private _renderStatusPills() {
    const connectivity = this._binaryState(this._ids.connectivity);
    // binary_sensor lock (device_class lock): "on" = unlocked, "off" = locked.
    // Anything else (missing entity, unavailable, unknown) is not "locked".
    const lock = this._binaryState(this._ids.lock);
    const hasErrors = this._isOn(this._ids.errors);
    const unavailable = localize(this.hass, "card.unavailable");

    return html`
      <div class="status-pills">
        ${hasErrors
          ? html`<ha-icon
              icon="mdi:alert-circle"
              class="error-pill-icon"
              title="${localize(this.hass, "card.errors")}"
            ></ha-icon>`
          : nothing}
        ${lock === null
          ? html`<div class="pill pill--lock pill--unknown">
              <ha-icon icon="mdi:lock-question"></ha-icon>
              <span>${unavailable}</span>
            </div>`
          : html`<div
              class="pill pill--lock ${lock === "off"
                ? "pill--locked"
                : "pill--unlocked"}"
            >
              <ha-icon
                icon="${lock === "off" ? "mdi:lock" : "mdi:lock-open-variant"}"
              ></ha-icon>
              <span
                >${lock === "off"
                  ? localize(this.hass, "card.locked")
                  : localize(this.hass, "card.unlocked")}</span
              >
            </div>`}
        ${connectivity === null
          ? html`<div class="pill pill--connectivity pill--unknown">
              <ha-icon icon="mdi:help-network-outline"></ha-icon>
              <span>${unavailable}</span>
            </div>`
          : html`<div
              class="pill pill--connectivity ${connectivity === "on"
                ? "pill--online"
                : "pill--offline"}"
            >
              <ha-icon
                icon="${connectivity === "on" ? "mdi:wifi" : "mdi:wifi-off"}"
              ></ha-icon>
              <span
                >${connectivity === "on"
                  ? localize(this.hass, "card.connected")
                  : localize(this.hass, "card.offline")}</span
              >
            </div>`}
      </div>
    `;
  }

  private _renderPolicy() {
    const entity = this._entity(this._ids.policy);
    const options = (entity?.attributes?.options as string[] | undefined) ?? [];
    const current: string = entity?.state ?? "";

    return html`
      <div class="row-section">
        <ha-icon icon="mdi:home-clock" class="section-icon"></ha-icon>
        <span class="section-label">${localize(this.hass, "card.policy")}</span>
        ${entity && this._isAvailable(this._ids.policy)
          ? html`
              <select
                class="policy-select"
                .value=${current}
                @change=${(e: Event) => this._onPolicyChange(e)}
              >
                ${options.map(
                  (opt) =>
                    html`<option value="${opt}" ?selected=${opt === current}>
                      ${this.hass.formatEntityState?.(entity, opt) ?? opt}
                    </option>`,
                )}
              </select>
            `
          : html`<span class="unavailable"
              >${localize(this.hass, "card.unavailable")}</span
            >`}
      </div>
    `;
  }

  private _renderActions() {
    return html`
      <div class="actions-row">
        <button
          class="action-btn action-btn--primary"
          ?disabled=${!this._isAvailable(this._ids.unlock)}
          @click=${() => this._onUnlock()}
          title="${localize(this.hass, "actions.unlock_title")}"
        >
          <ha-icon icon="mdi:lock-open-variant"></ha-icon>
          <span>${localize(this.hass, "actions.unlock")}</span>
        </button>

        <button
          class="action-btn action-btn--secondary"
          ?disabled=${!this._isAvailable(this._ids.reboot)}
          aria-haspopup="dialog"
          @click=${() => this._openRebootConfirm()}
          title="${localize(this.hass, "actions.restart_title")}"
        >
          <ha-icon icon="mdi:restart"></ha-icon>
          <span>${localize(this.hass, "actions.restart")}</span>
        </button>
      </div>
    `;
  }

  // ── Confirmation dialog ───────────────────────────────────────────────────
  //
  // HA's own confirmation dialog (showConfirmationDialog / "dialog-box") is
  // not reachable from a custom card: it is loaded through a private dynamic
  // import of the frontend bundle. A native modal <dialog> gives the same
  // guarantees: rendered in the top layer (no z-index or transformed-parent
  // issue), background made inert with focus kept inside, Escape closes it,
  // role "dialog" and focus restored to the trigger on close.

  private _openRebootConfirm() {
    this._rebootDialog?.showModal();
  }

  private _closeRebootConfirm() {
    if (this._rebootDialog?.open) this._rebootDialog.close();
  }

  private _renderRebootDialog() {
    return html`
      <dialog
        class="reboot-dialog"
        aria-labelledby="reboot-dialog-title"
        aria-describedby="reboot-dialog-question"
        @click=${(e: Event) => {
          // A click on the backdrop targets the <dialog> element itself.
          if (e.target === e.currentTarget) this._closeRebootConfirm();
        }}
        @close=${() => this._rebootButton?.focus()}
      >
        <div class="modal-header">
          <ha-icon
            icon="mdi:alert-circle"
            style="color:var(--warning-color,#ff9800)"
          ></ha-icon>
          <span id="reboot-dialog-title"
            >${localize(this.hass, "confirm_restart.title")}</span
          >
          <button
            class="modal-close"
            aria-label="${localize(this.hass, "actions.cancel")}"
            @click=${() => this._closeRebootConfirm()}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="modal-body">
          <p id="reboot-dialog-question">
            ${localize(this.hass, "confirm_restart.question")}
          </p>
          <p class="confirm-note">
            ${localize(this.hass, "confirm_restart.note")}
          </p>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn--cancel"
            autofocus
            @click=${() => this._closeRebootConfirm()}
          >
            ${localize(this.hass, "actions.cancel")}
          </button>
          <button
            class="btn btn--danger"
            @click=${() => this._onRebootConfirm()}
          >
            <ha-icon icon="mdi:restart"></ha-icon>
            ${localize(this.hass, "actions.restart")}
          </button>
        </div>
      </dialog>
    `;
  }

  // ── Main render ───────────────────────────────────────────────────────────

  protected render() {
    if (!this.hass || !this._config) return nothing;

    const title = this._config.name || localize(this.hass, "card.name_default");
    const pets = this._pets;

    if (!isConfigured(this._config)) {
      return html`
        <ha-card>
          <div
            class="card-body"
            style="text-align:center;color:var(--warning-color,#ff9800);padding:24px 16px;font-size:0.9rem;"
          >
            <ha-icon
              icon="mdi:alert-circle-outline"
              style="--mdc-icon-size:32px;display:block;margin:0 auto 8px;"
            ></ha-icon>
            ${localize(this.hass, "card.config_required")}
          </div>
        </ha-card>
      `;
    }

    this._ids = resolveEntities(this.hass, this._config);
    const ids = this._ids;

    return html`
      <ha-card>
        ${this._config.show_title
          ? html`
              <div class="card-header">
                <ha-icon icon="mdi:paw" class="header-icon"></ha-icon>
                <span class="header-title">${title}</span>
                ${this._renderStatusPills()}
              </div>
            `
          : html`<div class="card-header card-header--no-title">
              ${this._renderStatusPills()}
            </div>`}

        <div class="card-body">
          <onlycat-camera-panel
            .hass=${this.hass}
            .entityId=${ids.camera}
            .eventEntityId=${ids.event}
            .humanEntityId=${ids.human}
            .contrabandEntityId=${ids.contraband}
            .lastActivityEntityId=${ids.image}
            .pets=${pets}
          ></onlycat-camera-panel>
          ${this._config.show_pets
            ? html`<onlycat-pet-status
                .hass=${this.hass}
                .pets=${pets}
              ></onlycat-pet-status>`
            : nothing}
          ${this._renderPolicy()} ${this._renderActions()}
          <onlycat-activity-history
            .hass=${this.hass}
            .eventEntityId=${ids.event}
            .contrabandEntityId=${ids.contraband}
            .humanEntityId=${ids.human}
            .lockEntityId=${ids.lock}
            .pets=${pets}
            .historyDays=${this._config.history_days ?? DEFAULT_HISTORY_DAYS}
          ></onlycat-activity-history>
        </div>
      </ha-card>

      ${this._renderRebootDialog()}
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    /* ── Header ─────────────────────────────────────────────── */
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px 10px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
    }

    .card-header--no-title {
      justify-content: flex-end;
    }

    .header-icon {
      color: var(--primary-color);
      --mdc-icon-size: 22px;
      flex-shrink: 0;
    }

    .header-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Status pills ────────────────────────────────────────── */
    .status-pills {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .pill {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 99px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .pill ha-icon {
      --mdc-icon-size: 14px;
    }

    .pill--locked {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--success-color, #43a047) 15%, transparent);
      color: var(--success-color, #43a047);
    }
    .pill--unlocked {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--warning-color, #ffa600) 15%, transparent);
      color: var(--warning-color, #ffa600);
    }
    .pill--online {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--info-color, #039be5) 12%, transparent);
      color: var(--info-color, #039be5);
    }
    .pill--offline {
background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      color: var(--error-color, #db4437);
    }
    .pill--unknown {
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    .error-pill-icon {
      color: var(--error-color, #e53935);
      --mdc-icon-size: 24px;
      width: 24px;
      height: 24px;
      display: flex;
      flex-shrink: 0;
    }

    /* ── Body ────────────────────────────────────────────────── */
    .card-body {
      padding: 12px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* ── Shared row section ───────────────────────────────────── */
    .row-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-icon {
      color: var(--primary-color);
      --mdc-icon-size: 20px;
      flex-shrink: 0;
    }

    .section-label {
      font-size: 0.875rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .unavailable {
      font-size: 0.875rem;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    /* ── Policy select ────────────────────────────────────────── */
    .policy-select {
      flex: 1;
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 0.875rem;
      cursor: pointer;
      min-width: 0;
    }

    /* ── Action buttons ───────────────────────────────────────── */
    .actions-row {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 12px;
      border: none;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition:
        filter 0.15s,
        transform 0.1s;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-btn:not(:disabled):active {
      transform: scale(0.96);
      filter: brightness(0.9);
    }

    .action-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    .action-btn--primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .action-btn--secondary {
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #ccc);
    }

    /* ── Confirmation dialog ──────────────────────────────────── */
    .reboot-dialog {
      border: none;
      padding: 0;
      border-radius: 14px;
      max-width: 380px;
      width: 92%;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    }

    .reboot-dialog[open] {
      animation: slideUp 0.2s ease;
    }

    .reboot-dialog::backdrop {
      background: rgba(0, 0, 0, 0.6);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
      font-weight: 600;
      font-size: 0.95rem;
    }

    .modal-header ha-icon:first-child {
      color: var(--primary-color);
    }

    .modal-close {
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: background 0.15s;
    }

    .modal-close:hover {
      background: var(--secondary-background-color);
    }

    .modal-body {
      padding: 16px;
    }

    .modal-body p {
      margin: 0 0 8px;
      color: var(--primary-text-color);
      font-size: 0.9rem;
    }

    .confirm-note {
      color: var(--secondary-text-color) !important;
      font-size: 0.82rem !important;
    }

    .modal-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 10px 16px 14px;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition: filter 0.15s;
    }

    .btn:hover {
      filter: brightness(0.92);
    }

    .btn--cancel {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc);
    }

    .btn--danger {
      background: var(--error-color, #db4437);
      color: var(--text-primary-color, #fff);
    }

    .btn ha-icon {
      --mdc-icon-size: 16px;
    }
  `;
}

customElements.define("onlycat-home-assistant-card", OnlyCatHomeAssistantCard);

declare global {
  interface HTMLElementTagNameMap {
    "onlycat-home-assistant-card": OnlyCatHomeAssistantCard;
  }
}
