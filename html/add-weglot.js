/**
 * Add Weglot Translation Script to All HTML Files
 * This script uses Node.js to add the Weglot translation script to all HTML files in the directory
 * 
 * To use: 
 * 1. Install Node.js if not already installed
 * 2. Open a terminal/command prompt in this directory
 * 3. Run: node add-weglot.js
 */

const fs = require('fs');
const path = require('path');

// The Weglot script to be added
const weglotScript = `
  <script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      Weglot.initialize({
        api_key: 'wg_951e1f37be4f7f34083b855332ae37da6',
        originalLanguage: 'en',
        destinationLanguages: ['ar', 'fr', 'es'],
        hideLanguageButton: false,
        buttonPosition: 'bottom-right'
      });
    });
  </script>
`;

// Get all HTML files in the current directory
const htmlFiles = fs.readdirSync('.')
  .filter(file => file.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files to process.`);

// Process each HTML file
htmlFiles.forEach(file => {
  try {
    const filePath = path.join('.', file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if Weglot is already in the file
    if (content.includes('cdn.weglot.com/weglot.min.js')) {
      console.log(`${file}: Weglot script already present, skipping.`);
      return;
    }
    
    // Find the closing head tag and insert Weglot before it
    const headCloseTagIndex = content.indexOf('</head>');
    if (headCloseTagIndex === -1) {
      console.log(`${file}: Could not find </head> tag, skipping.`);
      return;
    }
    
    // Insert Weglot script before the closing head tag
    const updatedContent = 
      content.slice(0, headCloseTagIndex) + 
      weglotScript + 
      content.slice(headCloseTagIndex);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`${file}: Successfully added Weglot script.`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log('Done processing all HTML files.'); 