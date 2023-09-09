function sayA1() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Sheet");
  const range = sheet.getRange("A1");
  const value = range.getValue();
  Browser.msgBox(`A1: ${value}`);
}
