const fs = require('fs');
const path = require('path');

/**
 * Script to add hide-menu-items.js to all HTML files
 */

const scriptTag = '  <script src="js/hide-menu-items.js" type="text/javascript"></script>';
const htmlDirectory = './'; // Current directory (html folder)

// Function to get all HTML files
function getHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    return files.filter(file => file.endsWith('.html'));
}

// Function to add script tag to HTML file
function addScriptToHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if script is already added
        if (content.includes('hide-menu-items.js')) {
            console.log(`✅ Hide script already exists in: ${filePath}`);
            return;
        }
        
        // Find the closing body tag and add script before it
        const bodyCloseRegex = /(\s*)<\/body>/i;
        
        if (bodyCloseRegex.test(content)) {
            content = content.replace(bodyCloseRegex, `$1${scriptTag}\n$1</body>`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Added hide script to: ${filePath}`);
        } else {
            console.log(`❌ Could not find </body> tag in: ${filePath}`);
        }
        
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

// Main function
function main() {
    console.log('🚀 Starting to add hide-menu-items.js to all HTML files...\n');
    
    const htmlFiles = getHtmlFiles(htmlDirectory);
    
    if (htmlFiles.length === 0) {
        console.log(`❌ No HTML files found in: ${htmlDirectory}`);
        return;
    }
    
    console.log(`📁 Found ${htmlFiles.length} HTML files:`);
    htmlFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');
    
    // Process each HTML file
    htmlFiles.forEach(file => {
        const filePath = path.join(htmlDirectory, file);
        addScriptToHtmlFile(filePath);
    });
    
    console.log('\n🎉 Hide script addition completed!');
    console.log('\n📝 What this script does:');
    console.log('   - Hides: Schedule, Results, Videos, Tickets, Awards, FAQ, Gallery');
    console.log('   - Hides: Home 2, Home 3, Our Players, News, Store, Details pages');
    console.log('   - Keeps: About Us, Home 1, Contact Us, Our Ownership');
    console.log('   - Works on both navbar and footer');
    console.log('\n🔒 Your menu items are now hidden across all pages!');
    console.log('\n💡 To restore them later, add show-menu-items.js to any page');
}

// Run the script
main(); 