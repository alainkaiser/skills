# Expense Report Rules

Keep this skill portable: no local user-machine paths, OS-specific assumptions, static FX rates, or baked-in person names.

## Output

- Receipt folder: from prompt, current workspace, or clarification.
- XLSX: `Expense Report Guide.xlsx`.
- PDF: `expense report <report_user_name>.pdf`.
- PDF structure: generated summary page first, then original receipt PDFs in manifest order.
- Summary page: A4 landscape.
- Workbook: one sheet `Sheet1`; receipt table in `H:O`; car table in `A:F`.

## Workbook Columns

- `A1:E1`: `Travel Expenses Private Car`.
- `A2:F2`: `Date`, `km amount`, `Start`, `End`, `Resaon`, `Project` (keep typo).
- `H1:N1`: `Expenses with Receipt`.
- `H2:O2`: `Date`, `Nr. (Receipt ID)`, `Expense Type`, `Amount in CHF`, `Currency `, `Rate`, `Reason`, `Project`.
- Expense rows start at row 3.
- CHF amount goes in column `K`; FX audit note goes in column `M`.
- Totals: `Total:` and `Grand Total`; grand total is receipt total plus private-car reimbursement.
- Private-car reimbursement: kilometers times `0.5`.

## PDF Columns

Show only: `Date`, `Nr. (Receipt ID)`, `Expense Type`, `Amount in CHF`, `Currency`, `Reason`, `Project`.

## Categories

- `S100`: Public Transport
- `S110`: Hotel
- `S120`: Meals
- `S130`: Businesslunch
- `S140`: Taxi
- `S150`: Hardware
- `S160`: Software & Licences
- `S170`: Fringe Benefits
- `S180`: Others

Defaults:

- Software, SaaS, developer tools, and subscriptions: usually `S160`.
- Hardware/peripherals: usually `S150`.
- Public transport: `S100`.
- Use the `Project` value from the user's context, receipt notes, or explicit clarification. Do not invent project names.

## Currency

- Use exact booked CHF card/bank amounts when provided.
- Otherwise research current online exchange rates for every non-CHF currency before generating the report.
- Prefer SNB current exchange rates for CHF pairs. If unavailable, use ECB euro reference rates as fallback/cross-rate source.
- Do not use generic converter snippets, old report rates, or static examples.
- Every non-CHF row needs `rate_note` with source name, URL, publication date, retrieval date, rate, and calculation.
- If today's rate is not published, state the latest published absolute date.
- Round each CHF row amount to 2 decimals.

## Manifest

Top-level:

- `report_user_name`: required unless `--user-name` is passed.
- `expenses`: required list.
- `car_trips`: optional list.

Expense row:

- `source_pdf`: PDF path, preferably relative to manifest/receipt folder.
- `expense_type`, `amount_chf`, `currency`, `reason`, `project`: required.
- `original_amount`, `original_currency`: recommended.
- `rate_note`: required when `original_currency` is not `CHF`.

Car trip row:

- `date`, `km_amount`, `start`, `end`, `reason`, `project`.

## Checks

- No duplicate receipts.
- Generated files excluded from inputs.
- Every receipt PDF appended exactly once.
- Workbook has no stale rows/helper text from older reports.
- PDF first page renders cleanly and total matches the manifest.
