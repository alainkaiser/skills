---
name: create-expense-report
description: "Create expense reports from receipt PDFs and invoices, including step-by-step employee guidance when inputs are missing. Use when the user asks to prepare, update, validate, or generate an expense report, expense-report workbook, combined receipt PDF, or monthly/periodic expenses package from a user-provided receipts folder. Covers progressive intake, receipt extraction, category/project mapping, online exchange-rate research and traceability, editable XLSX generation, and final PDF generation with the template layout."
---

# Create Expense Report

Generate an editable `Expense Report Guide.xlsx` and final `expense report <report_user_name>.pdf` from receipt PDFs. Do not rely on any local template file, local user path, OS-specific command, or baked-in person name.

Before generating a report, read `references/template-rules.md`. Use `scripts/create_expense_report.py` after receipt rows are extracted and reviewed.

## Guided Intake

When the user asks for guidance or has not supplied everything needed, guide them progressively:

- Ask exactly one question or give exactly one next action per turn, then wait for the user's reply.
- Keep each turn short and label the current phase when useful, for example `Step 1 — Receipts`. Do not preview the full checklist.
- Do not present a multi-field intake form, ask the user to reply with several values, or list the eventual output files during intake.
- Inspect the prompt, current workspace, and receipts before asking. Never ask for information already supplied or safely inferable.
- Extract legible receipt values yourself, including the date, vendor, total amount, and currency. Never ask the user to transcribe them.
- If a receipt value is uncertain, try another extraction or rendering pass first. If it remains unreadable, ask for a clearer receipt copy; do not ask the user to transcribe individual values.
- For non-CHF receipts, research the CHF exchange rate automatically. Do not ask for permission or request the exact booked CHF amount by default.
- Ask conditional questions only when they become relevant, such as private-car travel near the end.
- Accept information the user volunteers early and skip the corresponding later questions.
- If the user supplies all required inputs up front, proceed without adding artificial confirmation turns.
- Resolve uncertain receipt details one focused question at a time. For many uncertainties, use small review batches only if the user prefers a faster review.

If no receipt folder is supplied and no receipt PDFs are available in the current workspace, the first response should contain only the first intake question, such as:

> Let's do this one step at a time.
>
> **Step 1 — Receipts:** Have you already collected copies of all receipts or invoices for this report into one folder? PDFs are preferred.

Stop after the question. If the receipts are not ready, give the user the single next action of collecting copies in one folder and ask them to return when ready. If they are ready, ask only for the folder path.

## Workflow

Treat each phase as a gate. Skip facts already known and questions that do not apply.

1. Establish receipt readiness, then obtain the folder path. Ask the user to put only copies for this report period in that folder; prefer PDFs.
2. Inspect the folder and existing reports to avoid duplicates; do not infer coverage from folder names alone. Report what was found before continuing.
3. Extract each receipt/invoice: date, id, vendor, amount, currency, billing period, description, payment status, and source PDF.
4. Ask for the report user name if it is still unknown.
5. Confirm the report period only when receipt dates or folder contents leave the intended scope ambiguous.
6. Classify rows using the template rules. Ask for project or cost context only where it cannot be inferred; do not assume every row has the same project.
7. Convert non-CHF receipt amounts automatically using trusted online CHF exchange rates. Use an exact booked CHF card/bank amount only when the user has already supplied it or an explicit expense policy requires it.
8. Ask whether private-car trips must be included. If yes, collect one trip at a time: date, kilometers, start, destination, reason, and project.
9. Create a manifest and present a compact review. Resolve uncertainties progressively, then ask for final confirmation before generation.
10. Run the generator and validate XLSX rows/formulas, PDF page count, first-page rendering, receipt order, total CHF, and FX notes.

## Manifest Shape

Use relative `source_pdf` paths when practical.

```json
{
  "report_user_name": "Jane Doe",
  "expenses": [
    {
      "source_pdf": "receipt.pdf",
      "expense_type": "S160",
      "original_amount": 100.00,
      "original_currency": "USD",
      "amount_chf": 0.00,
      "currency": "CHF",
      "rate_note": "USD/CHF <rate> from <source URL>, published <date>, retrieved <date>, calculation: <formula>",
      "reason": "Vendor subscription <period>",
      "project": "project-or-cost-context"
    }
  ],
  "car_trips": []
}
```

## Generator

The script is cross-platform Python 3.10+. It requires current compatible releases of `openpyxl`, `pypdf`, and `reportlab`; install or refresh them with:

```bash
python -m pip install --upgrade openpyxl pypdf reportlab
```

```bash
python scripts/create_expense_report.py --manifest expense-manifest.json --out-dir .
```

Default outputs:

- `Expense Report Guide.xlsx`
- `expense report <report_user_name>.pdf`
