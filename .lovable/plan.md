## Goal
Rewrite the "Longest idle" insight on the dashboard so a shop-floor user understands it instantly — no jargon, plain cause + plain fix.

## Current message
> 💡 **Longest idle:** 287 min (09:27 → 14:14) — lay **199-44**. Move a lay with spread ≤ 287 min earlier.

Problems:
- "Longest idle" doesn't say *what* was idle
- "287 min" forces mental math (≈ 4h 47m)
- The fix sentence reads like a formula, not an instruction
- No indication *which cutter* was waiting

## Proposed new message

> ⏱ **Biggest gap: Cutter sat idle for 4h 47m** (09:27 → 14:14)
> It was waiting for lay **199-44** to finish spreading.
> **Fix:** schedule another lay that spreads in under 4h 47m before this one, so the cutter has work during the gap.

Changes:
1. Lead with the impact in human time (`4h 47m` instead of `287 min`) — reuse existing `durStr()` helper.
2. Say plainly *who* was idle ("Cutter") and *why* (waiting for spreading).
3. Turn the fix into an action sentence, not a math expression.
4. Keep the same data points (times, lay no, duration) — only the wording changes.

## Green-state message (no idle)
Keep current ✅ "Both cutters fully utilized — zero idle time!" — already clear.

## Where the change lives
Single string in `index.html` inside `renderDashboard()` (around line 1496, the `${worst?...}` template).

No logic changes, no new data, no styling changes.