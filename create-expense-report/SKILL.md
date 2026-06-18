---
name: create-expense-report
description: "Create expense reports from receipt PDFs and invoices. Use when the user asks to prepare, update, validate, or generate an expense report, expense-report workbook, combined receipt PDF, or monthly/periodic expenses package from a user-provided receipts folder. Covers receipt extraction, category/project mapping, online exchange-rate research and traceability, editable XLSX generation, and final PDF generation with the template layout."
---

# Create Expense Report

Generate an editable `Expense Report Guide.xlsx` and final `expense report <report_user_name>.pdf` from receipt PDFs. Do not rely on any local template file, local user path, OS-specific command, or baked-in person name.

Before generating a report, read `references/template-rules.md`. Use `scripts/create_expense_report.py` after receipt rows are extracted and reviewed.

## Workflow

1. Get the receipt folder and report user name from the prompt, current workspace, or clarification.
2. Inspect existing reports in that folder/workspace to avoid duplicates; do not infer coverage from folder names alone.
3. Extract each receipt/invoice: date, id, vendor, amount, currency, billing period, description, payment status, and source PDF.
4. Classify rows using the template rules.
5. For non-CHF amounts, research current online CHF exchange rates from trusted sources unless the user provides exact booked CHF card/bank amounts.
6. Create a manifest, review uncertain rows with the user, then run the generator.
7. Validate XLSX rows/formulas, PDF page count, first-page rendering, receipt order, total CHF, and FX notes.

## User Prep

If the user is not ready yet, ask them to:

- Download every receipt/invoice as PDF.
- Put only copies of the PDFs for this report period in one folder.
- Provide the folder path and report user name.
- Provide exact booked CHF card/bank amounts when available; otherwise allow online FX lookup.

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
