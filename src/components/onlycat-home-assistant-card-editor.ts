import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { localize } from "../localize/localize";
import type { OnlyCatCardConfig } from "./types";

function deviceIdFromConnectivity(entityId: string): string {
  const match = entityId.match(/^binary_sensor\.(.+)_connectivity$/);
  return match ? match[1] : entityId;
}

class OnlyCatHomeAssistantCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @state() private _config!: OnlyCatCardConfig;

  private _t(key: Parameters<typeof localize>[1]): string {
    return localize(this.hass, key);
  }

  public setConfig(config: OnlyCatCardConfig): void {
    this._config = config;
  }

  private _connectivityEntities(): string[] {
    if (!this.hass?.states) return [];
    return Object.keys(this.hass.states).filter((id) =>
      /^binary_sensor\..+_connectivity$/.test(id),
    );
  }

  private _valueChanged(ev: Event) {
    const target = ev.target as HTMLInputElement | HTMLSelectElement;
    const key = target.getAttribute("data-key") as keyof OnlyCatCardConfig;
    if (!key) return;

    let value: string | number | boolean = target.value;
    if (target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    } else if (target.type === "number") {
      value = Number(target.value);
    }

    this._config = { ...this._config, [key]: value };
    this._fire();
  }

  private _fire() {
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: this._config } }),
    );
  }

  private get _selectedConnectivityEntity(): string {
    if (!this._config?.device_id) return "";
    return `binary_sensor.${this._config.device_id}_connectivity`;
  }

  protected render() {
    if (!this._config) return html``;

    const connectivityEntities = this._connectivityEntities();
    const selectedEntity = this._selectedConnectivityEntity;

    return html`
      <div class="editor">
        <!-- Card name -->
        <div class="field">
          <label>${localize(this.hass, "editor.card_name")}</label>
          <input
            type="text"
            data-key="name"
            .value=${this._config.name ?? ""}
            placeholder="${localize(this.hass, "card.name_default")}"
            @input=${this._valueChanged}
          />
        </div>

        <!-- Device picker (via connectivity entity) -->
        <div class="field">
          <label>
            ${localize(this.hass, "editor.device")} <span class="required">*</span>
          </label>
          ${connectivityEntities.length > 0
            ? html`
                <select
                  class="entity-select"
                  .value=${selectedEntity}
                  @change=${(e: Event) => {
                    const val = (e.target as HTMLSelectElement).value;
                    if (val) {
                      this._config = {
                        ...this._config,
                        device_id: deviceIdFromConnectivity(val),
                      };
                      this._fire();
                    }
                  }}
                >
                  <option value="" ?selected=${!selectedEntity}>
                    — ${localize(this.hass, "editor.device")} —
                  </option>
                  ${connectivityEntities.map(
                    (id) =>
                      html`<option
                        value="${id}"
                        ?selected=${id === selectedEntity}
                      >
                        ${id}
                      </option>`,
                  )}
                </select>
              `
            : html`
                <input
                  type="text"
                  data-key="device_id"
                  .value=${this._config.device_id ?? ""}
                  placeholder="only_cat"
                  @input=${this._valueChanged}
                />
              `}
          <span class="hint">${localize(this.hass, "editor.device_hint")}</span>
          ${this._config.device_id
            ? html`<code class="derived-id"
                >binary_sensor.${this._config.device_id}_connectivity</code
              >`
            : nothing}
        </div>

        <!-- Show title -->
        <div class="field field--checkbox">
          <label>
            <input
              type="checkbox"
              data-key="show_title"
              ?checked=${this._config.show_title !== false}
              @change=${this._valueChanged}
            />
            ${localize(this.hass, "editor.show_title")}
          </label>
        </div>
      </div>
    `;
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .field--checkbox {
      flex-direction: row;
      align-items: center;
    }

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--secondary-text-color);
    }

    input[type="text"],
    input[type="number"],
    .entity-select {
      padding: 8px 10px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 0.9rem;
    }

    .entity-select {
      cursor: pointer;
    }

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      cursor: pointer;
    }

    .hint {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }

    .derived-id {
      font-size: 0.78rem;
      background: var(--secondary-background-color);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--secondary-text-color);
      font-family: monospace;
    }

    .required {
      color: var(--error-color, #ef5350);
    }
  `;
}

customElements.define(
  "onlycat-home-assistant-card-editor",
  OnlyCatHomeAssistantCardEditor,
);
