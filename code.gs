// Code.gs - Main Google Apps Script file

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Architecture Decision Records')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Alternative: if you prefer to use the HTML content from a function instead of a file
// Uncomment the line below and comment out the function above
// function doGet() {
//   return HtmlService.createHtmlOutput(getHtmlContent())
//     .setTitle('Architecture Decision Records')
//     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
// }

// Debug function to test if the script can access the spreadsheet
function debugGetADRs() {
  try {
    console.log('Attempting to get or create ADR sheet...');
    const sheet = getOrCreateADRSheet();
    console.log('Sheet created/found:', sheet.getName());

    const data = sheet.getDataRange().getValues();
    console.log('Raw data from sheet:', data);

    if (data.length <= 1) {
      console.log('No data found (only headers or empty sheet)');
      return [];
    }

    const result = data.slice(1).map(row => ({
      timestamp: row[0],
      name: row[1],
      docLink: row[2],
      tags: row[3],
      redactor: row[4]
    }));

    console.log('Processed result:', result);
    return result;
  } catch (error) {
    console.error('Error in debugGetADRs:', error);
    throw error;
  }
}

// Simple test function that should always work
function testReturn() {
  console.log('testReturn called');
  return ["test"];
}

// Even simpler test
function simpleTest() {
  return "Hello from server";
}

function addADR(data) {
  try {
    // Get or create the ADR sheet
    const sheet = getOrCreateADRSheet();

    // Add timestamp
    const timestamp = new Date();

    // Add the new ADR record
    sheet.appendRow([
      timestamp,
      data.name,
      data.docLink,
      data.tags,
      data.redactor
    ]);

    return { success: true, message: 'ADR added successfully!' };
  } catch (error) {
    console.error('Error adding ADR:', error);
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

function getADRs() {
  try {
    console.log('Starting getADRs function...');
    const sheet = getOrCreateADRSheet();
    console.log('Sheet obtained:', sheet.getName());

    const data = sheet.getDataRange().getValues();
    console.log('Raw data:', data);
    console.log('Data length:', data.length);

    // Skip header row and return data
    if (data.length <= 1) {
      console.log('No data rows found, returning empty array');
      return [];
    }

    const result = data.slice(1).map(row => ({
      timestamp: row[0] ? row[0].toString() : '', // Convert Date to string
      name: row[1] || '',
      docLink: row[2] || '',
      tags: row[3] || '',
      redactor: row[4] || ''
    }));

    console.log('Processed result with string timestamps:', result);
    console.log('Returning result...');
    return result;
  } catch (error) {
    console.error('Error getting ADRs:', error);
    console.error('Error details:', error.toString());
    // Make sure we always return an array, never undefined
    return [];
  }
}

function getOrCreateADRSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('ADR Records');

  if (!sheet) {
    // Create the sheet if it doesn't exist
    sheet = spreadsheet.insertSheet('ADR Records');

    // Add headers
    sheet.getRange(1, 1, 1, 5).setValues([
      ['Timestamp', 'Name', 'Document Link', 'Tags', 'Redactor']
    ]);

    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 5);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');

    // Set column widths
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(2, 250); // Name
    sheet.setColumnWidth(3, 300); // Document Link
    sheet.setColumnWidth(4, 200); // Tags
    sheet.setColumnWidth(5, 150); // Redactor
  }

  return sheet;
}