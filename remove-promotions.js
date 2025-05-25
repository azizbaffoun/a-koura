const fs = require('fs');
const path = require('path');

// Directory containing HTML files
const htmlDir = path.join(__dirname, 'html');

// Function to walk through directories and find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search directories, but skip node_modules and similar
      if (!file.startsWith('.') && file !== 'node_modules') {
        findHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to remove promotional elements from HTML files
function removePromotionalElements(htmlFiles) {
  const elementsToRemove = [
    // Promotion labels wrapper
    /<div class="promotion-labels-wrapper-to-remove">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    
    // Left promotion label
    /<div class="promotion-label-left">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    
    // Right promotion label
    /<div class="promotion-label-right">[\s\S]*?<\/div>\s*<\/div>/g,
    
    // Footer rights wrapper
    /<div class="footer-rights-wrapper">[\s\S]*?<\/div>\s*<\/div>/g,
    
    // NEXT button and its container (collection-list-wrapper-6)
    /<div class="collection-list-wrapper-6 w-dyn-list">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    
    // NEXT button and its container (collection-list-wrapper-5)
    /<div class="collection-list-wrapper-5 w-dyn-list">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    
    // Cart wrapper
    /<div class="cart-wrapper">[\s\S]*?<\/div>\s*<\/div>/g,
    
    // Cart wrapper for home-2
    /<div data-open-product="" data-wf-cart-type="rightSidebar" data-wf-cart-query="" data-wf-page-link-href-prefix="" class="w-commerce-commercecartwrapper cart" data-node-type="commerce-cart-wrapper">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    
    // Get in Touch button header
    /<div data-w-id="ba67b287-f196-4627-29a8-f080f7e8b220" class="button-header-wrapper">[\s\S]*?<\/div>\s*<\/div>/g,
    
    // Get in Touch button for home-2
    /<div data-w-id="5e2102eb-70a4-ad79-ffc4-4b5745ccd338" class="button-header-wrapper">[\s\S]*?<\/div>\s*<\/div>/g,
    
    // No items found empty states
    /<div class="empty-state-4 w-dyn-empty">[\s\S]*?<\/div>\s*<\/div>/g,
    
    // Other empty states variations
    /<div class="w-dyn-empty">[\s\S]*?<\/div>\s*<\/div>/g,
    
    // Alternative pattern for empty states
    /<div class="empty-state-home-1 w-dyn-empty">[\s\S]*?<\/div>\s*<\/div>/g,
    
    // Continue to Checkout button
    /<a href="checkout\.html"[^>]*>Continue to Checkout<\/a>/g,
    
    // Entire checkout button container
    /<a href="checkout\.html"[^>]*class="w-commerce-commercecartcheckoutbutton[^"]*"[\s\S]*?<\/a>/g,
    
    // "No items found" text in various contexts
    /No items found\./g,
    
    // Commerce cart empty state
    /<div class="w-commerce-commercecartemptystate">[\s\S]*?<\/div>/g,
    
    // Another cart checkout pattern
    /<a href="checkout\.html"[^>]*>[\s\S]*?Continue to Checkout[\s\S]*?<\/a>/g,
    
    // Commerce cart component
    /<div[^>]*data-node-type="commerce-cart-container"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    
    // Empty cart container
    /<div[^>]*class="w-commerce-commercecartcontainerwrapper[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    
    // Another pattern for "No items found"
    /<div[^>]*>No items found\.<\/div>/g
  ];
  
  htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Apply each removal pattern
    elementsToRemove.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    
    // Only write back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`No changes needed for: ${filePath}`);
    }
  });
}

// Main execution
try {
  const htmlFiles = findHtmlFiles(htmlDir);
  console.log(`Found ${htmlFiles.length} HTML files.`);
  
  removePromotionalElements(htmlFiles);
  console.log('Update complete!');
} catch (error) {
  console.error('Error:', error);
} 