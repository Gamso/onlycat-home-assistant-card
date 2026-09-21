"""OnlyCat test camera – serves a static JPEG as a HA camera entity.

Also fakes the integration's per-pet presence trackers
(`device_tracker.<rfid>_tracker`) and moves them like the real integration
does (`Pet.update_from_subevent`) whenever the simulated flap event sensor
reports a direction.
"""

from __future__ import annotations

from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event

DOMAIN = "onlycat_test_camera"
EVENT_ENTITY = "binary_sensor.only_cat_event"

# rfid → (name, initial state)
PETS: dict[str, tuple[str, str]] = {
    "900123000000001": ("Minou", "home"),
    "900123000000002": ("Filou", "not_home"),
}


def _tracker(rfid: str) -> str:
    return f"device_tracker.{rfid}_tracker"


def _set_pet(hass: HomeAssistant, rfid: str, state: str) -> None:
    name = PETS[rfid][0]
    hass.states.async_set(
        _tracker(rfid),
        state,
        {"friendly_name": f"{name}'s presence", "source_type": "router"},
    )


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Create the fake pet trackers and follow the simulated passages."""
    for rfid, (_, initial) in PETS.items():
        _set_pet(hass, rfid, initial)

    @callback
    def _on_event(event: Event) -> None:
        new = event.data.get("new_state")
        old = event.data.get("old_state")
        if new is None or new.state != "on":
            return
        a = new.attributes
        if (
            old is not None
            and old.state == "on"
            and old.attributes.get("direction") == a.get("direction")
        ):
            return
        rfid = str(a.get("rfidCode") or "")
        if rfid not in PETS:
            return
        transit = a.get("action") == "TRANSIT"
        inward = a.get("direction") == "INWARD"
        _set_pet(hass, rfid, "home" if inward == transit else "not_home")

    @callback
    def _subscribe(_: Event | None = None) -> None:
        async_track_state_change_event(hass, [EVENT_ENTITY], _on_event)

    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _subscribe)
    return True
