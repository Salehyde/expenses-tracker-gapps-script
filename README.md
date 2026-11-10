# Expense Dashboard (Google Apps Script)

A personal expense dashboard that reads expenses logged through a Google Form and shows them as charts in a private web app. Everything runs inside Google Apps Script, and the sheet is never shared publicly. This repository holds the code for documentation and backup.

![Data pipeline](architecture.svg)

## What it shows

- **Current month total** as a large figure, with last month's total beneath it
- **Total spending by month:** a line chart with a start/end month slider and a label on every point
- **Share of spending by type:** a 100% stacked bar chart, one bar per month
- **Spending by type:** a small line chart for each type, with last month, average and peak figures, a dashed "month so far" segment, and an own/shared scale toggle
- **Refresh button** to load newly logged expenses without reloading the page

## How the data flows

1. **Google Form** (Data Collection): you log each expense.
2. **Google Sheets** (Data Cleaning / Data Engineering): the Form writes each response as a row in the sheet.
3. **Google Apps Script** (Data Dashboard): `Code.gs` reads the rows and the page turns them into charts. Credit types are treated as negative amounts here.

## Files

| File | Purpose |
| --- | --- |
| `Code.gs` | Server side. Serves the page and returns the sheet rows to it. |
| `Index.html` | Page structure and chart containers. |
| `Style.html` | CSS (colours, grid, dark mode), wrapped in `<style>` tags. |
| `Script.html` | JavaScript (totals, charts, month slider, refresh), wrapped in `<script>` tags. |
| `architecture.svg` | The pipeline diagram above. |

In Apps Script the three HTML files must be named `Index`, `Style` and `Script` (no extension), because `Code.gs` and `Index.html` load them by name.

## What the sheet needs

One tab (default name `Form 1 (Expenditure)`) with a header row and at least these three columns:

| Default header | Content |
| --- | --- |
| `Timestamp` | Date of the entry (the Form adds this automatically) |
| `Amount` | Number; currency symbols and commas are ignored |
| `Expenditure Type` | One of the types listed in `Script.html` |

Your headers may differ. Set the actual names at the top of `Code.gs`.

## Setup

1. Open the Google Sheet that receives the Form responses and go to **Extensions → Apps Script**.
2. Paste in `Code.gs`, then create three HTML files named `Index`, `Style` and `Script` and paste in the matching contents.
3. At the top of `Code.gs`, set `SHEET_NAME`, `COL_DATE`, `COL_AMOUNT` and `COL_CATEGORY`.
4. In `Script.html`, edit `CONFIG`: currency, number of months shown, and the expenditure types.
5. Go to **Deploy → New deployment → Web app**. Set **Execute as** to *Me* and **Who has access** to *Only myself*, then deploy and approve the permissions.
6. Open the web app link and bookmark it.

## Updating

After changing any file in the Apps Script editor, go to **Deploy → Manage deployments**, edit the deployment, choose **New version** and save. The same link then shows the changes. Changes made in the editor do not update this repository automatically, so copy them here when you want the documentation to match.

## Configuration

Set in `Script.html`:

- `CHART_CATEGORIES`: the types shown in the stacked bar chart and the small charts, in display order. Names must match the sheet (case is ignored).
- `CREDIT_CATEGORIES`: types that are always counted as negative, such as refunds. They reduce the monthly total but do not appear in the type charts.
- `CURRENCY`, `MONTHS_SHOWN`: currency symbol, and how many recent months the stacked bar and small charts cover. The total chart covers your whole history and the slider picks the period.
- `DATE_ORDER`: only used if a date arrives as text rather than a real date (`"DMY"` or `"MDY"`).

Any type that is not listed still counts towards the totals, and its name appears in the status line under the large figure, which helps catch spelling mismatches.

## Privacy

- The web app is deployed as *Only myself*, so opening it requires your Google sign-in.
- The sheet is not shared by link, and no sheet ID or credentials appear in the code.
- The code does reveal your tab name, column headers and spending categories. Use a private repository if you would rather not show those.

## Troubleshooting

- **"Column … not found":** the message lists the headers it found. Copy the correct name into `Code.gs`.
- **"Tab … not found":** check `SHEET_NAME` against the tab name, including spaces and brackets.
- **Changes not showing:** create a new version of the deployment (see Updating).
- **New entry missing:** wait a moment for the Form response to reach the sheet, then click **Refresh**.
- **Opening `Index.html` locally:** the charts will not load, because Apps Script supplies the `Style` and `Script` parts.

## Known limitations

- The month slider controls only the total chart. The other charts always show the last `MONTHS_SHOWN` months.
- The current month is partial, so its figures are "so far" and are left out of averages and peaks.
- Charts load Chart.js from the cdnjs CDN, so the page needs an internet connection.
th is partial, so its figures are "so far" and are left out of averages and peaks.
- Charts load Chart.js from the cdnjs CDN, so the page needs an internet connection.
