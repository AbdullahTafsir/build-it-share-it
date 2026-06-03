## Goal

Add a new **Simulation** window that takes the current input table (lays + shift/break settings) and automatically tries many scheduling strategies to find the plan that maximizes cutter / table / spreader utilization and minimizes total idle time. The user can then preview the simulated Gantt, schedule, dashboard, idle tracker and analytics for the best plan — and optionally apply it as the active plan.

## Where it lives

- New sidebar item **"Simulation"** under the *Planning* group in `index.html` (after "Schedule table"), with its own `<div class="panel" id="panel-simulation">`.
- Wired into the existing `switchPanel()` flow — no new route, same SPA shell.

## What the simulation does

The current `generateSchedule(laysIn, settings)` (index.html:826) already produces a full plan from one fixed lay order. The simulation runs it many times with different inputs and ranks the outputs.

Strategies tried per run (each becomes one "candidate" plan):
1. **As-entered** — current priority order (baseline).
2. **Shortest spread first** — sort by `spreadDur` asc.
3. **Longest spread first** — sort by `spreadDur` desc.
4. **Shortest cut first** — sort by `cutDur` asc.
5. **Longest cut first** — sort by `cutDur` desc.
6. **Largest total yards first** — sort by `totalYards` desc.
7. **Balanced (spread+cut)** — sort by `spreadDur+cutDur` asc.
8. **Spreader round-robin** — group by spreader, interleave to keep both spreaders busy.
9. **Randomized search** — N random shuffles (default 50) to explore the space.

Each candidate is scored on:
- `cutterUtilization%` (already computed in `summary.utilization`)
- `spreaderUtilization%` (new: sum of spread durations / spreader availability)
- `tableUtilization%` (new: derived from cutter busy + spreader-to-cutter handoff windows)
- `totalIdle` (minutes, lower = better)
- `makespan` (last cutEnd − shift start, lower = better)
- `overtime/gap issues` count

Composite score (configurable weights, defaults shown):
`score = 0.35·cutterUtil + 0.25·spreaderUtil + 0.20·tableUtil − 0.15·idleNorm − 0.05·overtimePenalty`

Highest score = "Best plan".

## Simulation panel UI

Header + controls card:
- "▶ Run simulation" button
- Strategy checkboxes (all on by default) + slider "Random shuffles: 50"
- Sliders for the 4 score weights (cutter / spreader / table / idle) so the user can bias toward what matters
- Status line: "Ran 58 candidates in 240 ms"

Results card (after run):
- **Leaderboard table** — one row per candidate: rank, strategy name, cutter util %, spreader util %, table util %, total idle (h m), makespan, issues, score. Best row highlighted green; click any row to preview.
- KPI strip for the currently-previewed candidate (reuses existing `.kpi-card` styles).
- **Simulated Gantt** — reuses `renderGantt(plan)` against the selected candidate.
- **Simulated schedule table** — reuses `renderSchedule(plan)`.
- **Simulated dashboard** — reuses `renderDashboard(plan)`.
- **Simulated idle tracker** — reuses `renderIdleTracker(plan)`.
- **Mini analytics** — bar chart comparing all candidates on the 4 utilization metrics so the user sees the trade-offs at a glance.

Action buttons:
- "✓ Apply as active plan" → sets `currentPlan = bestCandidate`, re-renders all existing panels, saves to Supabase via the existing `generatePlan()` save path.
- "⬇ Export comparison CSV" → leaderboard as CSV.

## Implementation notes (technical)

All work stays inside `index.html` (frontend-only). No DB schema changes — Supabase stays as today; only the *applied* plan is saved (current behavior).

New functions to add near `generateSchedule()`:
- `runSimulation(lays, settings, opts)` → returns `{candidates:[{name, plan, metrics, score}], best}`.
- `scoreCandidate(plan, settings, weights)` → returns metrics + composite score.
- `computeSpreaderUtil(plan, settings)` and `computeTableUtil(plan, settings)` — derived from existing `result[]` fields (`spreadStartMin/spreadEndMin`, `cutStart/cutEnd`, breaks).
- `renderSimulation()` — builds leaderboard, wires row-click preview, calls the existing render functions against the chosen candidate.

Sidebar + panel HTML inserted around index.html:507 (nav) and :626 (panels). `switchPanel('simulation')` triggers `renderSimulation()`.

No backend, no migrations, no edge functions. Existing `lays` table is the input source — simulation reads from the current input table state in-memory (same data `generatePlan()` already uses).

## Out of scope

- No changes to the scheduler logic itself for the *applied* plan unless the user clicks "Apply as active plan".
- No new tables. Simulation runs are not persisted (can add later if needed).
- No changes to the existing Gantt / Schedule / Dashboard / Idle / Analytics renderers — they are reused as-is against a candidate plan object.
