# Excel upload for Lay input table

Add a one-click Excel importer to the "Lay input table" card. The user picks an `.xlsx`/`.xls` file, the system reads the first sheet, maps columns by exact header names, and populates the table via the existing `addLayRow(...)` flow.

## UI changes (`index.html`, Lay input card ~line 661)

Add a new button next to "+ Add lay" / "Clear all":

```text
[+ Add lay]  [📥 Import Excel]  [🗑 Clear all]  [⬇ Download template]
```

- `📥 Import Excel` opens a hidden `<input type="file" accept=".xlsx,.xls">`.
- `⬇ Download template` generates a blank `.xlsx` with the exact headers below so the user always has a working template.

## Expected headers (exact match, case-insensitive, trimmed)

```text
Priority | Session | Lay no. | Style | Buyer | Color | Cut no. |
Marker length | Plies | Ratio | Total yards | Spreader |
Spread start | Spread dur (min) | Cut dur (min)
```

- Header lookup is case-insensitive and tolerates surrounding whitespace, but the spelling must match (e.g. "Lay no.", "Spread dur (min)"). Unknown columns are ignored. Missing optional columns become blank cells.
- Internal field mapping mirrors what `addLayRow({...})` already accepts (priority, session, layNo, style, buyer, color, cutNo, markerLen, plies, ratio, totalYards, spreader, spreadStart, spreadDur, cutDur — exact keys verified against current `addLayRow` before coding).

## Upload flow

1. User clicks **Import Excel** and picks a file.
2. Parse with **SheetJS (xlsx)** loaded from CDN (`https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js`) — added once via a `<script>` tag in `<head>`.
3. Read first non-empty sheet → `XLSX.utils.sheet_to_json(sheet, {defval:""})`.
4. Validate:
   - File must contain at least one recognized header. If none, show toast: "No matching columns found. Download the template for the expected headers."
   - Skip fully empty rows.
   - Per-row issues (e.g. non-numeric Plies) are kept as the raw cell value so the user can fix them inline; a summary toast reports counts: "Imported 14 rows · 2 rows with warnings".
5. **Replace vs Append prompt** (per user's choice "Ask me each time"): show a small modal with three buttons:
   - **Replace all** → call `clearLays()` then add the parsed rows.
   - **Append** → add the parsed rows after existing ones.
   - **Cancel** → discard the import.
6. For each accepted row, call `addLayRow(mappedObj)` — this reuses the existing rendering, validation, and Supabase-save paths. No scheduler/business-logic changes.

## Template download

`Download template` builds a workbook in-memory with one header row matching the list above, then triggers a download as `lay-input-template.xlsx` (via `XLSX.writeFile`).

## Out of scope

- No backend change (parsing is client-side; rows still save through the existing "Save lays to Supabase" button).
- No changes to scheduler, Gantt, or the schedule table.
- No CSV support (per user choice — Excel only).
- No column-mapping UI (headers must match the template).
