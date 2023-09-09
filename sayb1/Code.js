function sayB1() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Sheet");
  const range = sheet.getRange("B1");
  const value = range.getValue();
  Browser.msgBox(`B1: ${value}`);
}
