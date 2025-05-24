const fs = require('fs');
const path = require('path');

function removeWeglotWidget(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Add CSS to hide Weglot widget completely
    const hideWeglotCSS = `
  <style>
    /* Hide Weglot default widget */
    .weglot-container, 
    .country-selector,
    .wg-drop {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  </style>
`;

    // Find the closing head tag
    const headClosePos = content.indexOf('</head>');
    if (headClosePos === -1) {
      console.log(`No </head> found in ${filePath}`);
      return;
    }
    
    // Insert the CSS before the closing head tag
    const newContent = content.slice(0, headClosePos) + hideWeglotCSS + content.slice(headClosePos);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Added Weglot hide CSS to ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      // Skip .git and other hidden directories
      if (file.startsWith('.')) continue;
      
      try {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          processDirectory(filePath);
        } else if (file.endsWith('.html')) {
          removeWeglotWidget(filePath);
        }
      } catch (error) {
        console.error(`Error accessing ${filePath}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

console.log('Hiding default Weglot widget in all HTML files...');
processDirectory('html');
console.log('Done hiding Weglot widget.'); 