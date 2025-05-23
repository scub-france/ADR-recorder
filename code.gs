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
      data.redactor,
      data.projectName || '' // Add project name to a new column
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
      redactor: row[4] || '',
      projectName: row[5] || '' // Add project name from new column
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

    // Add headers - Updated to include Project Name
    sheet.getRange(1, 1, 1, 6).setValues([
      ['Timestamp', 'Name', 'Document Link', 'Tags', 'Redactor', 'Project Name']
    ]);

    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');

    // Set column widths
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(2, 250); // Name
    sheet.setColumnWidth(3, 300); // Document Link
    sheet.setColumnWidth(4, 200); // Tags
    sheet.setColumnWidth(5, 150); // Redactor
    sheet.setColumnWidth(6, 200); // Project Name
  }

  return sheet;
}

// ====== CONFIGURATION MANAGEMENT FUNCTIONS ======

/**
 * Get or create the Configuration sheet
 */
function getOrCreateConfigSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Configuration');

  if (!sheet) {
    // Create the configuration sheet
    sheet = spreadsheet.insertSheet('Configuration');

    // Create sections for different configuration items

    // Tags section
    sheet.getRange(1, 1).setValue('AVAILABLE TAGS');
    sheet.getRange(1, 1).setFontWeight('bold').setFontSize(14).setBackground('#34a853').setFontColor('white');

    // Add some example tags (you can edit/delete these in the Configuration sheet)
    const exampleTags = [
      'database',
      'backend',
      'frontend',
      'api'
    ];

    // Add example tags starting from row 2
    exampleTags.forEach((tag, index) => {
      sheet.getRange(index + 2, 1).setValue(tag);
    });

    // Projects section (starting from column C)
    sheet.getRange(1, 3).setValue('DEFAULT PROJECTS');
    sheet.getRange(1, 3).setFontWeight('bold').setFontSize(14).setBackground('#1a73e8').setFontColor('white');

    const exampleProjects = [
      'E-commerce Platform',
      'Mobile App'
    ];

    exampleProjects.forEach((project, index) => {
      sheet.getRange(index + 2, 3).setValue(project);
    });

    // Redactors section (starting from column E)
    sheet.getRange(1, 5).setValue('DEFAULT REDACTORS');
    sheet.getRange(1, 5).setFontWeight('bold').setFontSize(14).setBackground('#ea4335').setFontColor('white');

    const exampleRedactors = [
      'Jean Dupont',
      'Marie Martin'
    ];

    exampleRedactors.forEach((redactor, index) => {
      sheet.getRange(index + 2, 5).setValue(redactor);
    });

    // Set column widths
    sheet.setColumnWidth(1, 200); // Tags
    sheet.setColumnWidth(2, 50);  // Spacer
    sheet.setColumnWidth(3, 200); // Projects
    sheet.setColumnWidth(4, 50);  // Spacer
    sheet.setColumnWidth(5, 200); // Redactors

    // Add instructions
    sheet.getRange(10, 1, 4, 5).merge();
    sheet.getRange(10, 1).setValue(
      'INSTRUCTIONS - COMMENT CONFIGURER:\n' +
      '• Modifiez les valeurs dans les colonnes ci-dessus pour configurer les options disponibles\n' +
      '• Ajoutez de nouvelles lignes pour ajouter des options (tags, projets, rédacteurs)\n' +
      '• Supprimez des lignes pour retirer des options\n' +
      '• Les changements seront automatiquement pris en compte dans l\'application au rechargement'
    );
    sheet.getRange(10, 1).setWrap(true).setVerticalAlignment('top');
    sheet.getRange(10, 1).setBackground('#f1f3f4').setBorder(true, true, true, true, false, false);
  }

  return sheet;
}

/**
 * Get available tags from the configuration sheet
 */
function getAvailableTags() {
  try {
    const sheet = getOrCreateConfigSheet();
    const data = sheet.getDataRange().getValues();

    const tags = [];
    for (let i = 1; i < data.length; i++) { // Start from row 2 (index 1)
      const cellValue = data[i][0]; // Column A
      if (cellValue && cellValue.toString().trim() && cellValue !== 'AVAILABLE TAGS') {
        tags.push(cellValue.toString().trim());
      }
    }

    console.log('Available tags from config:', tags);
    return tags;
  } catch (error) {
    console.error('Error getting available tags:', error);
    // Return default tags if there's an error
    return ['database', 'backend', 'frontend', 'api', 'security', 'performance'];
  }
}

/**
 * Get available projects from the configuration sheet
 */
function getAvailableProjects() {
  try {
    const sheet = getOrCreateConfigSheet();
    const data = sheet.getDataRange().getValues();

    const projects = [];
    for (let i = 1; i < data.length; i++) { // Start from row 2 (index 1)
      const cellValue = data[i][2]; // Column C
      if (cellValue && cellValue.toString().trim() && cellValue !== 'DEFAULT PROJECTS') {
        projects.push(cellValue.toString().trim());
      }
    }

    console.log('Available projects from config:', projects);
    return projects;
  } catch (error) {
    console.error('Error getting available projects:', error);
    return ['E-commerce Platform', 'Mobile App', 'API Gateway'];
  }
}

/**
 * Get available redactors from the configuration sheet
 */
function getAvailableRedactors() {
  try {
    const sheet = getOrCreateConfigSheet();
    const data = sheet.getDataRange().getValues();

    const redactors = [];
    for (let i = 1; i < data.length; i++) { // Start from row 2 (index 1)
      const cellValue = data[i][4]; // Column E
      if (cellValue && cellValue.toString().trim() && cellValue !== 'DEFAULT REDACTORS') {
        redactors.push(cellValue.toString().trim());
      }
    }

    console.log('Available redactors from config:', redactors);
    return redactors;
  } catch (error) {
    console.error('Error getting available redactors:', error);
    return ['Jean Dupont', 'Marie Martin'];
  }
}

/**
 * Get all configuration data at once
 */
function getConfiguration() {
  try {
    return {
      tags: getAvailableTags(),
      projects: getAvailableProjects(),
      redactors: getAvailableRedactors()
    };
  } catch (error) {
    console.error('Error getting configuration:', error);
    return {
      tags: ['database', 'backend', 'frontend', 'api'],
      projects: ['E-commerce Platform', 'Mobile App'],
      redactors: ['Jean Dupont', 'Marie Martin']
    };
  }
}

/**
 * Helper function to easily add tags to the Configuration sheet
 * Usage: addTagsToConfig(['database', 'backend', 'security', 'api'])
 */
function addTagsToConfig(newTags) {
  try {
    // Validate input
    if (!newTags || !Array.isArray(newTags)) {
      console.error('addTagsToConfig: newTags must be an array');
      return { success: false, message: 'Error: newTags must be an array. Usage: addTagsToConfig([\'tag1\', \'tag2\'])' };
    }

    if (newTags.length === 0) {
      return { success: false, message: 'Error: No tags provided' };
    }

    const sheet = getOrCreateConfigSheet();

    // Find the last row with data in column A (tags)
    const data = sheet.getDataRange().getValues();
    let lastRow = 1; // Start after header

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim() && data[i][0] !== 'AVAILABLE TAGS') {
        lastRow = i + 1;
      }
    }

    console.log('Last row found:', lastRow);
    console.log('Adding tags:', newTags);

    // Add new tags starting from the next available row
    newTags.forEach((tag, index) => {
      if (tag && tag.toString().trim()) {
        sheet.getRange(lastRow + 1 + index, 1).setValue(tag.toString().trim());
        console.log(`Added tag "${tag}" at row ${lastRow + 1 + index}`);
      }
    });

    return { success: true, message: `${newTags.length} tags added successfully!` };
  } catch (error) {
    console.error('Error adding tags:', error);
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

/**
 * Helper function to easily add projects to the Configuration sheet
 * Usage: addProjectsToConfig(['Project 1', 'Project 2'])
 */
function addProjectsToConfig(newProjects) {
  try {
    // Validate input
    if (!newProjects || !Array.isArray(newProjects)) {
      console.error('addProjectsToConfig: newProjects must be an array');
      return { success: false, message: 'Error: newProjects must be an array. Usage: addProjectsToConfig([\'project1\', \'project2\'])' };
    }

    if (newProjects.length === 0) {
      return { success: false, message: 'Error: No projects provided' };
    }

    const sheet = getOrCreateConfigSheet();

    const data = sheet.getDataRange().getValues();
    let lastRow = 1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][2] && data[i][2].toString().trim() && data[i][2] !== 'DEFAULT PROJECTS') { // Column C
        lastRow = i + 1;
      }
    }

    console.log('Last project row found:', lastRow);
    console.log('Adding projects:', newProjects);

    newProjects.forEach((project, index) => {
      if (project && project.toString().trim()) {
        sheet.getRange(lastRow + 1 + index, 3).setValue(project.toString().trim());
        console.log(`Added project "${project}" at row ${lastRow + 1 + index}`);
      }
    });

    return { success: true, message: `${newProjects.length} projects added successfully!` };
  } catch (error) {
    console.error('Error adding projects:', error);
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

/**
 * Helper function to easily add redactors to the Configuration sheet
 * Usage: addRedactorsToConfig(['John Doe', 'Jane Smith'])
 */
function addRedactorsToConfig(newRedactors) {
  try {
    // Validate input
    if (!newRedactors || !Array.isArray(newRedactors)) {
      console.error('addRedactorsToConfig: newRedactors must be an array');
      return { success: false, message: 'Error: newRedactors must be an array. Usage: addRedactorsToConfig([\'name1\', \'name2\'])' };
    }

    if (newRedactors.length === 0) {
      return { success: false, message: 'Error: No redactors provided' };
    }

    const sheet = getOrCreateConfigSheet();

    const data = sheet.getDataRange().getValues();
    let lastRow = 1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][4] && data[i][4].toString().trim() && data[i][4] !== 'DEFAULT REDACTORS') { // Column E
        lastRow = i + 1;
      }
    }

    console.log('Last redactor row found:', lastRow);
    console.log('Adding redactors:', newRedactors);

    newRedactors.forEach((redactor, index) => {
      if (redactor && redactor.toString().trim()) {
        sheet.getRange(lastRow + 1 + index, 5).setValue(redactor.toString().trim());
        console.log(`Added redactor "${redactor}" at row ${lastRow + 1 + index}`);
      }
    });

    return { success: true, message: `${newRedactors.length} redactors added successfully!` };
  } catch (error) {
    console.error('Error adding redactors:', error);
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

/**
 * Test function to populate configuration with sample data
 * Run this function to add sample configuration data
 */
function populateSampleConfiguration() {
  console.log('Populating sample configuration...');

  // Add sample tags
  const tagsResult = addTagsToConfig([
    'security',
    'performance',
    'architecture',
    'infrastructure',
    'testing',
    'deployment',
    'monitoring',
    'documentation'
  ]);
  console.log('Tags result:', tagsResult);

  // Add sample projects
  const projectsResult = addProjectsToConfig([
    'API Gateway',
    'Data Pipeline',
    'Authentication Service',
    'Monitoring Dashboard'
  ]);
  console.log('Projects result:', projectsResult);

  // Add sample redactors
  const redactorsResult = addRedactorsToConfig([
    'Pierre Durand',
    'Sophie Bernard',
    'Michel Leblanc',
    'Claire Dubois'
  ]);
  console.log('Redactors result:', redactorsResult);

  return {
    tags: tagsResult,
    projects: projectsResult,
    redactors: redactorsResult
  };
}