const fs = require('fs');
const path = require('path');

function addWeglotScript(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if Weglot already included
    if(content.includes('weglot.min.js')) {
      console.log(`Weglot already in ${filePath}`);
      return;
    } 
    
    // Find the </head> tag
    const headEndPos = content.indexOf('</head>');
    if(headEndPos === -1) {
      console.log(`No </head> found in ${filePath}`);
      return;
    }
    
    // Prepare Weglot script with our custom integration
    const weglotScript = `  <!-- Weglot Translation Integration -->
  <script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
  <script>
    Weglot.initialize({
        api_key: 'wg_951e1f37be4f7f34083b855332ae37da6',
        hide_switcher: true
    });
  </script>
  <!-- Custom language switcher for integration with Weglot -->
  <script src="js/weglot-custom.js" type="text/javascript"></script>
  <script src="js/language-switcher.js" type="text/javascript"></script>
  <script src="js/arabic-translations.js" type="text/javascript"></script>
`;
    
    // Insert script before </head>
    const newContent = content.slice(0, headEndPos) + weglotScript + content.slice(headEndPos);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Added Weglot to ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    for(const file of files) {
      const filePath = path.join(dir, file);
      
      // Skip .git and other hidden directories
      if(file.startsWith('.')) continue;
      
      try {
        const stats = fs.statSync(filePath);
        if(stats.isDirectory()) {
          processDirectory(filePath);
        } else if(file.endsWith('.html')) {
          addWeglotScript(filePath);
        }
      } catch (error) {
        console.error(`Error accessing ${filePath}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

// Start processing from current directory
processDirectory('.'); 