const fs = require('fs');
const path = require('path');

/**
 * Script to replace all 'Undefeated', 'Vision Sportis', and 'Vision Sport' with 'Sports Vision' in all HTML files in the current directory
 */

const htmlDirectory = './'; // Current directory (should be /html)
const patterns = [
    /Undefeated/g,
    /Vision Sportis/g,
    /\bVision Sport\b/g // Only standalone 'Vision Sport'
];
const replacement = 'Sports Vision';

function getHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    return files.filter(file => file.endsWith('.html'));
}

function replaceInHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let totalReplacements = 0;
        patterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                totalReplacements += matches.length;
                content = content.replace(pattern, replacement);
            }
        });
        if (totalReplacements > 0) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Replaced ${totalReplacements} occurrence(s) in: ${filePath}`);
        } else {
            console.log(`⏩ No occurrences in: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

function main() {
    console.log('🚀 Starting branding replacement in all HTML files...\n');
    const htmlFiles = getHtmlFiles(htmlDirectory);
    if (htmlFiles.length === 0) {
        console.log(`❌ No HTML files found in: ${htmlDirectory}`);
        return;
    }
    console.log(`📁 Found ${htmlFiles.length} HTML files:`);
    htmlFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');
    htmlFiles.forEach(file => {
        const filePath = path.join(htmlDirectory, file);
        replaceInHtmlFile(filePath);
    });
    console.log('\n🎉 Branding replacement completed!');
    console.log('\n📝 All "Undefeated", "Vision Sportis", and "Vision Sport" are now "Sports Vision" in your HTML files!');
}

main(); 