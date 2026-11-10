/**
 * Expense dashboard – Google Apps Script back end.
 * Add this file, Index.html, Style.html and Script.html to the Apps Script
 * project attached to your Google Sheet (Extensions → Apps Script).
 */

// ===== Edit these to match your sheet =====
const SHEET_NAME = "Form 1 (Expenditures)";
const COL_DATE = "Record Date";
const COL_AMOUNT = "Amount";
const COL_CATEGORY = "Spending Type";
// ==========================================

function doGet() {
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Expense dashboard")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

// Pulls the contents of Style.html / Script.html into Index.html
function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

// Called by the page via google.script.run
function getRows() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Tab "' + SHEET_NAME + '" not found.');

  const values = sheet.getDataRange().getValues();
  const head = values[0].map(function (h) {
    return String(h).trim();
  });
  function col(name) {
    const i = head.indexOf(name);
    if (i < 0)
      throw new Error(
        'Column "' + name + '" not found. Headers found: ' + head.join(", "),
      );
    return i;
  }
  const iD = col(COL_DATE),
    iA = col(COL_AMOUNT),
    iC = col(COL_CATEGORY);
  const tz = ss.getSpreadsheetTimeZone();

  return values
    .slice(1)
    .filter(function (r) {
      return r[iD] !== "" && r[iA] !== "";
    })
    .map(function (r) {
      const d = r[iD];
      return {
        // Date objects can't be sent to the page, so send a plain yyyy-MM-dd string
        date:
          d instanceof Date
            ? Utilities.formatDate(d, tz, "yyyy-MM-dd")
            : String(d),
        amount: r[iA],
        cat: String(r[iC]),
      };
    });
}
