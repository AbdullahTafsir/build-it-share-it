## What to add

A new "Fleece fabric spreaders" row in the **Shift settings** card on the Input tab, with five checkboxes (SPR-1 … SPR-5). Any spreader checked is treated as a fleece spreader for that day. The scheduler then adds a **3-minute setup** as busy spreader time before every spread on those spreaders (including the first one of the shift).

## UI changes (`index.html`, Shift settings card ~line 604)

Add below the existing 4-field grid:

```text
Fleece fabric spreaders (3-min setup before every spread)
[ ] SPR-1   [ ] SPR-2   [ ] SPR-3   [ ] SPR-4   [ ] SPR-5
```

State is read at schedule time as `fleeceSpreaders: Set<number>` from `#fleeceSpr1..5`. Persisted in the saved-plan settings blob alongside shift start/end so reload restores them.

## Scheduler changes (`generateSchedule`, ~line 947)

- Pass `fleeceSpreaders` through `settings`.
- For each candidate `(table t, cutter c)`:
  - `setup = fleeceSpreaders.has(t) ? 3 : 0`
  - `earliestSpreadStart = max(shiftStart, tableReady[t]) + setup` (setup occupies the spreader, so `tableReady[t]` advances by `setup` after this lay completes — i.e. `tableReady[t] = spreadEnd` already accounts for it because the setup window precedes spreadStart, not follows spreadEnd).
  - Setup window must not overlap a break: if `[spreadStart-setup, spreadStart)` crosses a break, push spreadStart past the break and recompute.
- Record `setupDur` (0 or 3) on each result row so the Gantt and Schedule can show it.
- All three scheduling branches in `generateSchedule` (best-fit, fallback, manual) apply the same rule.

## Visuals

- **Gantt** (~line 1961): render a small grey/striped `g-bar g-setup` segment of width `setupDur` immediately before each spread bar on fleece spreader rows. Add a CSS class `.g-setup` (light grey, hatched).
- **Schedule table** (~line 1385): no new column; add a small "+3m setup" note next to Spread start when `setupDur > 0`.
- **Gantt section label** for fleece rows: append `(Fleece · 3m setup)` to the SPR-X label.
- **CSV export** (~line 2418): add `Setup (min)` column.

## Rules panel (~line 2134)

Add: "Fleece fabric spreaders require a 3-minute setup before every spread; setup time counts as spreader-busy and cannot overlap breaks."

## Out of scope

- No DB schema change (fleece flags live in the settings JSON of the saved plan).
- No change to cutter logic, table-wait/BLOCKED rules, or simulation weights.
