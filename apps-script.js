/**
 * ═══════════════════════════════════════════════════════════════════════
 * COLLEGE OFFICE HUB — Google Apps Script Backend
 * A. Philip Randolph Campus High School
 * ═══════════════════════════════════════════════════════════════════════
 *
 * SETUP INSTRUCTIONS (do this once):
 *
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *    Name it "College Office Hub Data".
 *
 * 2. In that spreadsheet, click Extensions → Apps Script.
 *
 * 3. Delete everything in the editor and paste this entire file in.
 *
 * 4. Click Save (💾), then run the "setup" function once:
 *    - Click the function dropdown (says "Select function")
 *    - Choose "setup"
 *    - Click Run ▶
 *    - Accept any permissions it asks for
 *    This creates all the sheet tabs with the right columns.
 *
 * 5. Set your admin password:
 *    - In the function dropdown choose "setPassword"
 *    - BEFORE running, edit the line below to set your password:
 *        var PASSWORD = 'your-password-here';
 *    - Click Run ▶
 *
 * 6. Deploy as a Web App:
 *    - Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 *    - Copy the Web App URL
 *
 * 7. Paste the Web App URL into index.html where it says:
 *        const APPS_SCRIPT_URL = '';
 *
 * ═══════════════════════════════════════════════════════════════════════
 */


/* ── Sheet tab names ─────────────────────────────────────────────────── */
var SHEETS = {
  slideshow:    'Slideshow',
  applying:     'Applying',
  pathways:     'Pathways',
  financialAid: 'FinancialAid',
  scholarships: 'Scholarships',
  guides:       'Guides',
  social:       'Social',
  newsletters:  'Newsletters',
  youthLeaders: 'YouthLeaders',
  staff:        'Staff'
};

/* ── Column headers per sheet ────────────────────────────────────────── */
var HEADERS = {
  slideshow:    ['tag','headline','sub','cta','url','image','emoji','theme','placeholder'],
  links:        ['emoji','label','sub','url','tag','placeholder'],
  newsletters:  ['emoji','label','sub','url','tag','placeholder'],
  youthLeaders: ['name','role','assigned','free','work','email'],
  staff:        ['name','role','room','hours','about','email']
};

/* ─────────────────────────────────────────────────────────────────────
   GET  — returns all data as JSON
         ?check=1&pw=xxx  →  password verification
   ───────────────────────────────────────────────────────────────────── */
function doGet(e) {
  var params = e ? e.parameter : {};

  // Password check endpoint
  if (params.check === '1') {
    var stored = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
    var valid  = stored && (params.pw === stored);
    return json({ valid: valid });
  }

  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var data = {};
  for (var key in SHEETS) {
    var sheet = ss.getSheetByName(SHEETS[key]);
    data[key] = sheet ? sheetToObjects(sheet) : [];
  }
  return json(data);
}

/* ─────────────────────────────────────────────────────────────────────
   POST — saves all data (password checked server-side)
   ───────────────────────────────────────────────────────────────────── */
function doPost(e) {
  try {
    var body     = JSON.parse(e.postData.contents);
    var stored   = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
    var payload  = body.data;

    if (!stored || body.password !== stored) {
      return json({ error: 'Unauthorized' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    for (var key in SHEETS) {
      if (payload[key] !== undefined) {
        var sheet = ss.getSheetByName(SHEETS[key]);
        if (sheet) objectsToSheet(sheet, payload[key]);
      }
    }
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message });
  }
}

/* ─────────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────────── */
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheetToObjects(sheet) {
  var vals = sheet.getDataRange().getValues();
  if (vals.length < 2) return [];
  var headers = vals[0].map(String);
  return vals.slice(1)
    .filter(function(row) { return String(row[0]).trim() !== ''; })
    .map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        if (!h) return;
        var v = row[i];
        // Booleans stored as TRUE/FALSE in sheets
        if (v === true  || v === 'TRUE'  || v === 'true')  obj[h] = true;
        else if (v === false || v === 'FALSE' || v === 'false') obj[h] = false;
        else obj[h] = v === null || v === undefined ? '' : String(v);
      });
      return obj;
    });
}

function objectsToSheet(sheet, objects) {
  // Keep header row, delete all data rows
  var last = sheet.getLastRow();
  if (last > 1) sheet.deleteRows(2, last - 1);
  if (!objects || objects.length === 0) return;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  var rows = objects.map(function(obj) {
    return headers.map(function(h) {
      return obj[h] !== undefined ? obj[h] : '';
    });
  });
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

/* ─────────────────────────────────────────────────────────────────────
   SETUP — run once to create all sheet tabs
   ───────────────────────────────────────────────────────────────────── */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  function makeSheet(name, headers) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    sheet.clearContents();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    // Bold header row
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    return sheet;
  }

  makeSheet(SHEETS.slideshow,    HEADERS.slideshow);
  makeSheet(SHEETS.applying,     HEADERS.links);
  makeSheet(SHEETS.pathways,     HEADERS.links);
  makeSheet(SHEETS.financialAid, HEADERS.links);
  makeSheet(SHEETS.scholarships, HEADERS.links);
  makeSheet(SHEETS.guides,       HEADERS.links);
  makeSheet(SHEETS.social,       HEADERS.links);
  makeSheet(SHEETS.newsletters,  HEADERS.newsletters);
  makeSheet(SHEETS.youthLeaders, HEADERS.youthLeaders);
  makeSheet(SHEETS.staff,        HEADERS.staff);

  // Remove the default "Sheet1" if it exists and is empty
  var sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && ss.getSheets().length > 1) ss.deleteSheet(sheet1);

  SpreadsheetApp.getUi().alert('✅ Setup complete! All tabs created.\n\nNow run setPassword() to set your admin password, then deploy as a Web App.');
}

/* ─────────────────────────────────────────────────────────────────────
   SET PASSWORD — edit the password below, then run this function once
   ───────────────────────────────────────────────────────────────────── */
function setPassword() {
  var PASSWORD = 'change-me'; // ← Change this before running!
  PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD', PASSWORD);
  SpreadsheetApp.getUi().alert('✅ Password set successfully.');
}
