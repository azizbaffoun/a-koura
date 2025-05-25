const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function updateNavbar(filePath) {
  try {
    // Read the HTML file
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(htmlContent);

    // Check if language switcher already exists
    const existingLanguageSwitcher = $('.language-switcher');
    
    if (existingLanguageSwitcher.length > 0) {
      console.log(`Language switcher already exists in ${filePath}`);
      return;
    }

    // Find the navbar header right block - different templates might have different structures
    let headerRightBlock = $('.header-right-block-wrapper').first();
    
    // If doesn't exist, try finding alternative containers
    if (headerRightBlock.length === 0) {
      headerRightBlock = $('.nav-menu-wrapper').first();
      
      if (headerRightBlock.length === 0) {
        console.log(`Could not find header block in ${filePath}`);
        return;
      }
    }

    // Create language switcher HTML
    const languageSwitcherHtml = `
    <div class="language-switcher">
      <a href="#" data-lang="en" class="active">EN</a>
      <a href="#" data-lang="ar">AR</a>
    </div>`;

    // Insert at the beginning of the header right block
    headerRightBlock.prepend(languageSwitcherHtml);

    // Save the updated HTML
    fs.writeFileSync(filePath, $.html());
    console.log(`Added language switcher to ${filePath}`);

  } catch (error) {
    console.error(`Error updating navbar in ${filePath}:`, error.message);
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
          updateNavbar(filePath);
        }
      } catch (error) {
        console.error(`Error accessing ${filePath}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

console.log('Checking and updating language switcher in HTML files...');
processDirectory('html');
console.log('Finished updating language switchers.'); 