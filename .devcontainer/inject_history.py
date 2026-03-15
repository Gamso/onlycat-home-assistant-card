#!/usr/bin/env python3
"""
Inject simulated 3-day calendar history into the HA recorder DB
for OnlyCat test entities.

Covers today + yesterday + day before yesterday (UTC calendar days) so the
history chart's ◄ ► navigation has data on all three pages.

Run at any time: existing events for the covered days are deleted first so
the data is always fresh.
"""

import datetime
import os
import random
import sqlite3
import sys
import time

DB_PATH = "/config/home-assistant_v2.db"
DAYS = 3  # number of calendar days to cover (today counts as day 0)

# Target entities and their event profiles (avg_per_hour, duration_min, duration_max)
ENTITY_PROFILES: dict[str, tuple[float, float, float]] = {
    "binary_sensor.only_cat_event":      (1.5, 30,  120),  # ~1-2 passages/h, 30-120 s
    "binary_sensor.only_cat_contraband": (0.14, 10,  30),  # ~1 every 7 h,   10-30 s
    "binary_sensor.only_cat_human":      (0.10,  5,  20),  # ~1 every 10 h,   5-20 s
}


def _day_boundaries(days_ago: int) -> tuple[float, float]:
    """Return (start_ts, end_ts) in UTC unix seconds for `days_ago` calendar days ago.

    days_ago=0 → today midnight–now
    days_ago=1 → yesterday midnight–midnight
    """
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    today_midnight = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
    day_start = today_midnight - datetime.timedelta(days=days_ago)
    if days_ago == 0:
        day_end = now_utc
    else:
        day_end = day_start + datetime.timedelta(days=1)
    return day_start.timestamp(), day_end.timestamp()


def fake_events(
    window_start: float, window_end: float,
    avg_per_hour: float, dur_min: float, dur_max: float,
) -> list[tuple[float, float]]:
    """Return a sorted list of (on_ts, off_ts) pairs within the given window."""
    hours = (window_end - window_start) / 3600.0
    n = max(1, round(avg_per_hour * hours + random.gauss(0, 0.5)))
    events: list[tuple[float, float]] = []
    attempts = 0
    while len(events) < n and attempts < n * 20:
        attempts += 1
        margin = min(dur_max + 30, (window_end - window_start) / 10)
        on_ts = random.uniform(window_start + margin, window_end - dur_max - margin)
        dur = random.uniform(dur_min, dur_max)
        off_ts = on_ts + dur
        if off_ts > window_end:
            continue
        # Require at least 5-minute gap between events
        if any(abs(on_ts - s) < 300 for s, _ in events):
            continue
        events.append((on_ts, off_ts))
    events.sort()
    return events


def main() -> None:
    print("💉 inject_history.py – injecting OnlyCat test history (3 days)…")

    if not os.path.exists(DB_PATH):
        print("⚠️  DB not found – skipping injection.")
        print("   Home Assistant will create the DB on first boot.")
        sys.exit(0)

    con = sqlite3.connect(DB_PATH, isolation_level=None)
    con.execute("PRAGMA journal_mode=WAL")
    cur = con.cursor()

    # Verify HA has already initialized the schema
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='states'")
    if not cur.fetchone():
        print("⚠️  DB exists but schema not initialized – skipping injection.")
        print("   Let Home Assistant boot once to create the schema, then rebuild.")
        con.close()
        sys.exit(0)

    # Overall window: start of DAYS-ago calendar day → now
    window_start, _ = _day_boundaries(DAYS - 1)
    window_end, _ = _day_boundaries(0)
    window_end = time.time()  # use precise current time as end

    for entity_id, (avg_per_hour, dur_min, dur_max) in ENTITY_PROFILES.items():
        # ── Find or create metadata_id ────────────────────────────────────────
        cur.execute(
            "SELECT metadata_id FROM states_meta WHERE entity_id = ?", (entity_id,)
        )
        row = cur.fetchone()
        if row:
            metadata_id = row[0]
            # Delete any existing states in our window to avoid duplicates
            cur.execute(
                "DELETE FROM states WHERE metadata_id = ? "
                "AND last_changed_ts >= ? AND last_changed_ts <= ?",
                (metadata_id, window_start, window_end),
            )
            deleted = cur.execute("SELECT changes()").fetchone()[0]  # type: ignore[index]
            if deleted:
                print(f"  🗑  {entity_id}: removed {deleted} stale states.")
        else:
            cur.execute(
                "INSERT INTO states_meta (entity_id) VALUES (?)", (entity_id,)
            )
            metadata_id = cur.lastrowid  # type: ignore[assignment]

        # ── Generate one batch of events per calendar day ─────────────────────
        all_periods: list[tuple[float, float]] = []
        for days_ago in range(DAYS):
            day_start_ts, day_end_ts = _day_boundaries(days_ago)
            all_periods.extend(
                fake_events(day_start_ts, day_end_ts, avg_per_hour, dur_min, dur_max)
            )
        all_periods.sort()
        print(f"  📊 {entity_id}: inserting {len(all_periods)} events over {DAYS} days…")

        # ── Insert on/off state pairs ─────────────────────────────────────────
        # Fetch the last existing old_state_id before our window
        cur.execute(
            "SELECT state_id FROM states WHERE metadata_id = ? "
            "AND last_changed_ts < ? ORDER BY last_changed_ts DESC LIMIT 1",
            (metadata_id, window_start),
        )
        prev_row = cur.fetchone()
        prev_state_id: int | None = prev_row[0] if prev_row else None

        for on_ts, off_ts in all_periods:
            cur.execute(
                """
                INSERT INTO states
                    (entity_id, state, attributes, last_changed_ts,
                     last_reported_ts, last_updated_ts, old_state_id,
                     metadata_id, origin_idx)
                VALUES (?, 'on', '{}', ?, ?, ?, ?, ?, 0)
                """,
                (entity_id, on_ts, on_ts, on_ts, prev_state_id, metadata_id),
            )
            on_id: int = cur.lastrowid  # type: ignore[assignment]

            cur.execute(
                """
                INSERT INTO states
                    (entity_id, state, attributes, last_changed_ts,
                     last_reported_ts, last_updated_ts, old_state_id,
                     metadata_id, origin_idx)
                VALUES (?, 'off', '{}', ?, ?, ?, ?, ?, 0)
                """,
                (entity_id, off_ts, off_ts, off_ts, on_id, metadata_id),
            )
            prev_state_id = cur.lastrowid  # type: ignore[assignment]

    con.commit()
    con.close()
    print("✅ History injection complete.")


if __name__ == "__main__":
    main()
