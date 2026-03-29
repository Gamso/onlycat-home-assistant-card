import { LitElement, html, nothing, css } from "lit";
import { property, state } from "lit/decorators.js";
import "./onlycat-home-assistant-card-editor";
import "./onlycat-camera-panel";
import "./onlycat-activity-history";
import { localize, localizeFormat } from "../localize/localize";
import type { OnlyCatCardConfig } from "./types";

class OnlyCatHomeAssistantCard extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @state() private _config!: OnlyCatCardConfig;

  @state() private _showRebootConfirm = false;

  // ── Entity ID helpers ──────────────────────────────────────────────────────

  private get _deviceId() {
    return this._config?.device_id ?? "";
  }
  private get _cameraEntityId() {
    return `camera.${this._deviceId}_last_activity_video`;
  }
  private get _lockEntityId() {
    return `binary_sensor.${this._deviceId}_lock`;
  }
  private get _connectivityEntityId() {
    return `binary_sensor.${this._deviceId}_connectivity`;
  }
  private get _policyEntityId() {
    return `select.${this._deviceId}_policy`;
  }
  private get _unlockEntityId() {
    return `button.${this._deviceId}_unlock`;
  }
  private get _rebootEntityId() {
    return `button.${this._deviceId}_reboot`;
  }
  private get _eventEntityId() {
    return `binary_sensor.${this._deviceId}_event`;
  }
  private get _contrabandEntityId() {
    return `binary_sensor.${this._deviceId}_contraband`;
  }
  private get _humanEntityId() {
    return `binary_sensor.${this._deviceId}_human`;
  }
  private get _lastActivityEntityId() {
    return `image.${this._deviceId}_last_activity_image`;
  }
  private get _errorsEntityId() {
    return `binary_sensor.${this._deviceId}_errors`;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  public static getStubConfig(): OnlyCatCardConfig {
    return {
      name: "",
      device_id: "",
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
      device_id: config.device_id ?? "",
      show_title: config.show_title !== false,
    };
  }

  public getCardSize(): number {
    return 5;
  }

  // ── State helpers ─────────────────────────────────────────────────────────

  private _entity(entityId: string) {
    return this.hass?.states?.[entityId];
  }

  private _isOn(entityId: string): boolean {
    return this._entity(entityId)?.state === "on";
  }

  private _t(key: Parameters<typeof localize>[1]): string {
    return localize(this.hass, key);
  }

  private _tf(
    key: Parameters<typeof localizeFormat>[1],
    vars: Record<string, string | number>,
  ): string {
    return localizeFormat(this.hass, key, vars);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  private _onUnlock() {
    if (!this._entity(this._unlockEntityId)) return;
    this.hass.callService("button", "press", {
      entity_id: this._unlockEntityId,
    });
  }

  private _onRebootConfirm() {
    if (!this._entity(this._rebootEntityId)) return;
    this.hass.callService("button", "press", {
      entity_id: this._rebootEntityId,
    });
    this._showRebootConfirm = false;
  }

  private _onPolicyChange(ev: Event) {
    const option = (ev.target as HTMLSelectElement).value;
    if (!option) return;
    this.hass.callService("select", "select_option", {
      entity_id: this._policyEntityId,
      option,
    });
  }

  // ── Render helpers ────────────────────────────────────────────────────────

  private _renderStatusPills() {
    const connected = this._isOn(this._connectivityEntityId);
    // binary_sensor lock: "on" = unlocked, "off" = locked
    const locked = !this._isOn(this._lockEntityId);
    const hasErrors = this._isOn(this._errorsEntityId);

    return html`
      <div class="status-pills">
        ${hasErrors
          ? html`<ha-icon
              icon="mdi:alert-circle"
              class="error-pill-icon"
              title="${localize(this.hass, "card.errors")}"
            ></ha-icon>`
          : nothing}
        <div class="pill ${locked ? "pill--locked" : "pill--unlocked"}">
          <ha-icon
            icon="${locked ? "mdi:lock" : "mdi:lock-open-variant"}"
          ></ha-icon>
          <span
            >${locked
              ? localize(this.hass, "card.locked")
              : localize(this.hass, "card.unlocked")}</span
          >
        </div>
        <div class="pill ${connected ? "pill--online" : "pill--offline"}">
          <ha-icon icon="${connected ? "mdi:wifi" : "mdi:wifi-off"}"></ha-icon>
          <span
            >${connected
              ? localize(this.hass, "card.connected")
              : localize(this.hass, "card.offline")}</span
          >
        </div>
      </div>
    `;
  }

  private _renderPolicy() {
    const entity = this._entity(this._policyEntityId);
    const options: string[] = entity?.attributes?.options ?? [];
    const current: string = entity?.state ?? "";

    return html`
      <div class="row-section">
        <ha-icon icon="mdi:home-clock" class="section-icon"></ha-icon>
        <span class="section-label">${localize(this.hass, "card.policy")}</span>
        ${entity
          ? html`
              <select
                class="policy-select"
                .value=${current}
                @change=${(e: Event) => this._onPolicyChange(e)}
              >
                ${options.map(
                  (opt) =>
                    html`<option value="${opt}" ?selected=${opt === current}>
                      ${opt}
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
          @click=${() => this._onUnlock()}
          title="${localize(this.hass, "actions.unlock_title")}"
        >
          <ha-icon icon="mdi:lock-open-variant"></ha-icon>
          <span>${localize(this.hass, "actions.unlock")}</span>
        </button>

        <button
          class="action-btn action-btn--secondary"
          @click=${() => (this._showRebootConfirm = true)}
          title="${localize(this.hass, "actions.restart_title")}"
        >
          <ha-icon icon="mdi:restart"></ha-icon>
          <span>${localize(this.hass, "actions.restart")}</span>
        </button>
      </div>
    `;
  }

  // ── Modals ────────────────────────────────────────────────────────────────

  private _renderRebootModal() {
    if (!this._showRebootConfirm) return nothing;
    return html`
      <div
        class="modal-backdrop"
        @click=${(e: Event) => {
          if (e.target === e.currentTarget) this._showRebootConfirm = false;
        }}
      >
        <div class="modal modal--confirm" role="dialog" aria-modal="true">
          <div class="modal-header">
            <ha-icon
              icon="mdi:alert-circle"
              style="color:var(--warning-color,#ff9800)"
            ></ha-icon>
            <span>${localize(this.hass, "confirm_restart.title")}</span>
            <button
              class="modal-close"
              @click=${() => (this._showRebootConfirm = false)}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="modal-body">
            <p>${localize(this.hass, "confirm_restart.question")}</p>
            <p class="confirm-note">
              ${localize(this.hass, "confirm_restart.note")}
            </p>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn--cancel"
              @click=${() => (this._showRebootConfirm = false)}
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
        </div>
      </div>
    `;
  }

  // ── Main render ───────────────────────────────────────────────────────────

  protected render() {
    if (!this.hass || !this._config) return nothing;

    const title = this._config.name || localize(this.hass, "card.name_default");

    if (!this._config.device_id) {
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
            .entityId=${this._cameraEntityId}
            .eventEntityId=${this._eventEntityId}
            .humanEntityId=${this._humanEntityId}
            .contrabandEntityId=${this._contrabandEntityId}
            .lastActivityEntityId=${this._lastActivityEntityId}
          ></onlycat-camera-panel>
          ${this._renderPolicy()} ${this._renderActions()}
          <onlycat-activity-history
            .hass=${this.hass}
            .eventEntityId=${this._eventEntityId}
            .contrabandEntityId=${this._contrabandEntityId}
            .humanEntityId=${this._humanEntityId}
            .lockEntityId=${this._lockEntityId}
            .historyHours=${24}
          ></onlycat-activity-history>
        </div>
      </ha-card>

      ${this._renderRebootModal()}
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
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50;
    }
    .pill--unlocked {
      background: rgba(255, 152, 0, 0.15);
      color: #ff9800;
    }
    .pill--online {
      background: rgba(33, 150, 243, 0.12);
      color: #29b6f6;
    }
    .pill--offline {
      background: rgba(244, 67, 54, 0.12);
      color: #ef5350;
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

    .action-btn:active {
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

    /* ── Modals ───────────────────────────────────────────────── */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.15s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal {
      background: var(--card-background-color);
      border-radius: 14px;
      max-width: 520px;
      width: 92%;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      animation: slideUp 0.2s ease;
    }

    .modal--confirm {
      max-width: 380px;
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
      background: var(--error-color, #ef5350);
      color: #fff;
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
