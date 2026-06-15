## Goal

Rework the in-browser scheduler in `index.html` (`generateSchedule`, ~lines 1020–1219) so the generated plan:

1. Has near-zero overtime (cut work past shift end).
2. Keeps spreader tables running back-to-back (no large mid-day gaps like on Spreader-2 and Spreader-5 in the screenshot).
3. Automatically routes a lay to a **manual cutter** when the best auto-cutter option would leave that lay waiting > 30 minutes for cutting.

No UI/layout changes — only scheduling logic + the resulting badge/status.

## Changes

### 1. Auto-promote to manual on >30 min wait
In the auto branch (~line 1147), after computing the best `(table, cutter)` candidate:
- If `best.wait > 30`, discard the auto choice and instead run the manual-cut branch (try all 5 tables, no auto cutter consumed). Mark the lay `status='MANUAL'`, `cutterNum='M'`, `isManual=true`, push to `result`, and `continue`.
- Net effect: BLOCKED disappears — every lay that would block an auto cutter becomes a manual cut automatically. `WAIT_LIMIT` becomes the manual-promotion threshold instead of just a status tag.

### 2. Selection scoring: penalize overtime + spreader gap
Replace the current "minimize wait, then cutEnd, then prefer requested table" tiebreaker with a weighted cost per candidate:

```
spreaderGap = max(0, sp.start - tableReady[t])   // idle time on the table before this lay
overtime    = max(0, ct.end - shE)
cost = wait*1.0 + overtime*3.0 + spreaderGap*1.5 + (ct.end - shS)*0.05
       + (t === requested ? 0 : 0.5)
```
Pick the candidate with the lowest cost. This naturally:
- Prefers cutters/tables that don't push work past `shiftEnd` (kills overtime).
- Prefers tables that are already free now over tables that would sit idle (closes the Spreader-2/5 gaps).
- Keeps existing wait minimization and requested-table tiebreak.

### 3. Tighten the "first lay per table" cap
The current `cap = firstOnTable ? shS+30 : null` only constrains the very first lay per table. Apply the same idea generally: when choosing a table, prefer one whose `tableReady[t] ≈ floor` (already covered by the `spreaderGap` term in the cost above), so this becomes a side-effect of the new scoring — no separate code path needed, but keep the existing 30-min start cap intact for the first lay.

### 4. Status derivation unchanged otherwise
After the new logic:
- `status='MANUAL'` for auto-promoted lays (and pre-flagged manual lays).
- `status='OVERTIME'` only if a manual fallback still finishes past `shE` (rare).
- `status='GAP'` only when 5 < wait ≤ 30.
- `BLOCKED` effectively never fires (kept in `normalizePlan` for backward compatibility with old saved plans).

### 5. `normalizePlan` (line 1223)
Update the rule: `wait > 30` → mark as `MANUAL` (not `BLOCKED`) so old saved plans render consistently with the new behavior when reopened. Keep `BLOCKED` only if `cutterNum` is a real auto cutter and the lay was never promoted (defensive).

## Files touched

- `index.html` — `generateSchedule` and `normalizePlan` only.

## Verification

- Open the preview, regenerate the current plan, and confirm:
  - Spreader rows are visually back-to-back (no >30-min white gaps mid-shift).
  - Overtime hatched regions on cutters shrink toward zero; any remaining lays past 18:00 are MANUAL.
  - Lays that previously showed BLOCKED now show MANUAL with `cutterNum='M'`.
  - KPI strip's "Total cutter idle time" drops.
