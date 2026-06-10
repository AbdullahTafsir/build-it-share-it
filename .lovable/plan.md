## Goal

Rewrite the scheduler in `index.html` so it treats the user-assigned spreader as a **hint only**, considers all 5 tables, aligns spreading to cutter availability, and flags lays whose table wait exceeds 30 minutes.

## Rules

1. **5 tables checked every time** — for each lay, evaluate all 5 spreader/tables (1..5), not only the one the user picked in the Input tab. The user's choice is a preference / tie-breaker, not a constraint.
2. **Resource readiness** — at scheduling time compute:
   - `tableReady[1..5]` — when each table/spreader frees up (previous lay releases the table after ≥60% of its cut is complete, as today).
   - `cutterReady[1..nC]` — when each Auto Cutter (1, 2, …) becomes free.
3. **Align spread-end to cutter-ready** — for each candidate `(table, cutter)` pair:
   - earliestSpreadStart = max(shiftStart, tableReady[table])
   - target spreadStart so that `spreadEnd == cutterReady[cutter]` (delay start if possible)
   - clamp to earliestSpreadStart; recompute spreadEnd across breaks
   - tableWait = max(0, cutStart − spreadEnd) where cutStart = max(spreadEnd, cutterReady[cutter])
4. **Pick the best pair** — minimise `tableWait`, then earliest `cutEnd`, then prefer the user-assigned spreader as a tie-breaker.
5. **Break handling** — unchanged; no spreading or cutting inside break windows.
6. **BLOCKED + Manual Cut** — if best `tableWait > 30 min`:
   - mark `status = "BLOCKED"` (red badge in Schedule + red wait segment in Gantt)
   - render a **Suggest Manual Cut** button on the row; clicking it flips that lay to `cutterNum = "MANUAL"`, sets `cutStart = spreadEnd` (no auto-cutter wait), removes it from the auto-cutter queue, and re-renders all panels.
7. **Reassignment visibility** — when the scheduler picks a different table than the user requested, the Schedule row shows the assigned table with a small "moved from SPR-X" note so the user can see what changed.
8. **Overtime** — still allowed; Gantt axis already extends past shift end.

## Where the changes go (all in `index.html`)

- `generateSchedule(laysIn, settings)` (~line 947) — replace the single-spreader greedy loop with the 5-table candidate search + align-to-cutter logic above. Keep the 60% spreader-release rule.
- Per-row result — add `tableWait`, `assignedSpreader` (final), `requestedSpreader` (user's input), and extend `status` to `OK | OVERTIME | BLOCKED | MANUAL`.
- `renderSchedule(plan)` (~1860) — BLOCKED badge, "Switch to Manual Cut" button, "moved from SPR-X" note when reassigned.
- `renderGantt(plan)` (~1799) — red wait band for BLOCKED rows; MANUAL cuts on a dedicated "Manual" cutter row.
- New `switchToManualCut(layNo)` — mutates `currentPlan`, re-runs `generateSchedule` with that lay flagged manual, re-renders.
- Simulation reuses the upgraded scheduler automatically — no changes there.

## Out of scope

- No DB schema changes, no Input tab column changes, no Simulation weight changes.
