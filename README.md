# OnlyCat Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card to monitor
and control your **OnlyCat** smart cat flap via the
[onlycat-home-assistant](https://github.com/OnlyCatAI/onlycat-home-assistant)
integration.

![Card Preview](assets/card_preview.png)

---

## Features

| Feature              | Description                                                                 | Entity used                                                  |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 📷 Camera snapshot   | Last activity snapshot; tap (or Enter) opens the HA more-info dialog with the video stream | `camera.<device_id>_last_activity_video`                     |
| 🕒 Last activity     | "x min ago" label on the snapshot, from the image entity or the event sensors, with the direction and cat of the last passage | `image.<device_id>_last_activity_image`                      |
| 🔒 Lock status       | Locked / Unlocked pill, "Unavailable" when the sensor is missing or offline | `binary_sensor.<device_id>_lock`                             |
| 📡 Connectivity      | Connected / Offline pill, "Unavailable" when the sensor is missing           | `binary_sensor.<device_id>_connectivity`                     |
| ⚠️ Device errors     | Warning icon in the header while the device reports errors                  | `binary_sensor.<device_id>_errors`                           |
| 🚪 Door policy       | Drop-down selector of the device policies                                   | `select.<device_id>_policy`                                  |
| 🔓 Unlock button     | One-tap unlock (disabled when the entity is unavailable)                    | `button.<device_id>_unlock`                                  |
| 🔄 Reboot button     | Reboot with confirmation dialog (disabled when the entity is unavailable)   | `button.<device_id>_reboot`                                  |
| 📊 Activity timeline | Collapsible day-by-day timeline with zoom                                   | `binary_sensor.<device_id>_event` · `_contraband` · `_human` · `_lock` |
| ↔️ Entry / exit      | Each passage colored by direction, with the pet's name                      | `binary_sensor.<device_id>_event` (`direction`, `action`, `rfidCode`) |
| 🐈 Pets              | Inside / outside chip per pet, and one timeline row each                    | `device_tracker.<rfid>_tracker`                              |

### Activity timeline detail

- **Rows**: Passage (flap), one row per pet, Prey detected, Human detected.
- **Direction**: passages are green for an entry and orange for an exit; a
  passage that didn't go through (the integration's `action` other than
  `TRANSIT`) is drawn hollow with a dashed outline. Passages without an event
  summary stay blue.
- **Pet rows**: a light band shows when the pet was outside, with that pet's
  passages on top. The tooltip and the zoom show the direction and which pet
  went through.
- **Calendar-day navigation** with ◄ ► arrows to browse past days (up to `history_days`, 10 by default).
  Days run from midnight to midnight in the time zone of your HA profile (server zone by default), like the HA history panel.
- **Tooltip** on each bar shows start time, end time and duration.
- **Zoom overlay**: hover a bar with a mouse, or tap it on a touch screen, to open a magnified window centered on the event,
  with ◄ ► buttons to move to the previous/next event and a close button.
  A lock icon marks passages that coincide with an unlock (`binary_sensor.<device_id>_lock`).

### Languages

English and French, following the language of the HA user profile.

---

## Installation

### HACS (recommended)

1. Add this repository to HACS as a custom **Dashboard** (frontend) repository.
2. Search for **OnlyCat Card** and install it.
3. HACS automatically registers the JS resource.

### Manual

1. Download `onlycat-home-assistant-card.js` from the latest [release](https://github.com/Gamso/onlycat-home-assistant-card/releases)
   (or from the `dist/` folder) and copy it to `<config>/www/`.
2. In **Settings → Dashboards → ⋮ → Resources**, add `/local/onlycat-home-assistant-card.js` as a **JavaScript module**.
3. Reload the browser.

---

## Configuration

The visual editor lets you pick the OnlyCat device (only devices of the OnlyCat integration are listed).

### Minimal

```yaml
type: custom:onlycat-home-assistant-card
device: 3f1c0e8a9b7d4c2e8f6a1b2c3d4e5f60 # HA device, as set by the visual editor
```

or, as in earlier versions, with the OnlyCat device id:

```yaml
type: custom:onlycat-home-assistant-card
device_id: oc_0cbfb5801849
```

### Full options

```yaml
type: custom:onlycat-home-assistant-card
device: 3f1c0e8a9b7d4c2e8f6a1b2c3d4e5f60 # HA device of the cat flap (or device_id below)
device_id: oc_0cbfb5801849 # OnlyCat device id, prefix of the entity ids
name: "Cat flap" # Optional — card title
show_title: true # Optional — show the card title bar (default: true)
history_days: 10 # Optional — past days reachable in the timeline (default: 10)
show_pets: true # Optional — show the per-pet inside/outside chips (default: true)
pets: # Optional — defaults to every named OnlyCat pet tracker
  - device_tracker.900123000000001_tracker
  - entity: device_tracker.900123000000002_tracker
    name: Filou # Optional — defaults to the tracker's name
    color: "#7e57c2" # Optional
entities: # Optional — only for entities you renamed
  lock: binary_sensor.cat_flap_lock
  policy: select.cat_flap_policy
```

Entities are found automatically: the ids listed above when they exist, otherwise the entities of the
device in the entity registry (so renamed entities keep working). The `entities` keys are `camera`, `image`,
`lock`, `connectivity`, `errors`, `event`, `contraband`, `human`, `policy`, `unlock` and `reboot`.

### Pets

The integration creates a tracker for every chip it reads, including visitors
that aren't registered in the OnlyCat app. Those have no name (the tracker is
named after the chip code), so auto-discovery leaves them out. The timeline then
only shows passages by your cats: visitors' passages, and passages where no
chip was read, are hidden. List a visitor under `pets` to show it anyway.
Without any cat to match (integration older than v2.0.7), every passage is
shown.

Entry/exit and per-pet data need version **2.0.7** or later of the integration,
which adds the event summary (`direction`, `action`, `rfidCode`) to the flap
event sensor. With older versions, passages are simply shown without a
direction.

### Theming

Colors follow the HA theme (`--success-color`, `--warning-color`, `--info-color`, `--error-color`).
The timeline can be recolored with `--history-in-color`, `--history-out-color`, `--history-flap-color`,
`--history-contraband-color` and `--history-human-color`.

---

## Development

```bash
npm ci
npm run build      # dist/onlycat-home-assistant-card.js (committed, used by HACS)
npm run watch      # rebuild on change, with a source map
npm test           # Vitest
npm run lint && npm run typecheck
```

The `.devcontainer` starts a Home Assistant instance with simulated OnlyCat entities,
including two pet trackers and a passage simulator (direction, action, chip).

---

## License

[MIT](LICENSE)
