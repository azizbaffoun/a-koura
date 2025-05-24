const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Directory containing HTML files
const htmlDir = path.join(__dirname, 'html');
const outputFile = path.join(__dirname, 'image-dimensions.md');

// Function to find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        findHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to extract image information from HTML files
async function extractImageInfo(htmlFiles) {
  const imageInfo = {};
  const allSizes = {};
  
  for (const filePath of htmlFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const $ = cheerio.load(content);
      const pageName = path.basename(filePath);
      
      imageInfo[pageName] = {
        sections: {}
      };
      
      // Process images with inline width/height
      $('img').each((index, element) => {
        const img = $(element);
        const src = img.attr('src') || 'Unknown';
        const alt = img.attr('alt') || 'No description';
        const width = img.attr('width');
        const height = img.attr('height');
        
        // Find the closest section or container
        let sectionName = 'Unknown Section';
        const section = img.closest('section, div[class*="section"], div[class*="container"]');
        if (section.length) {
          sectionName = section.attr('class') || 'Unnamed Section';
          // Try to get a more specific name
          const heading = section.find('h1, h2, h3, h4, h5, h6').first().text().trim();
          if (heading) {
            sectionName = heading;
          }
        }
        
        if (!imageInfo[pageName].sections[sectionName]) {
          imageInfo[pageName].sections[sectionName] = [];
        }
        
        // Check if we need to look at CSS for dimensions
        let cssWidth = null;
        let cssHeight = null;
        
        if (!width || !height) {
          const style = img.attr('style');
          if (style) {
            const widthMatch = style.match(/width:\s*(\d+)px/);
            const heightMatch = style.match(/height:\s*(\d+)px/);
            
            if (widthMatch) cssWidth = widthMatch[1];
            if (heightMatch) cssHeight = heightMatch[1];
          }
        }
        
        // Use CSS values if inline attributes are not present
        const finalWidth = width || cssWidth || 'Auto';
        const finalHeight = height || cssHeight || 'Auto';
        
        // Track all sizes for analysis
        const sizeKey = `${finalWidth}x${finalHeight}`;
        if (sizeKey !== 'Autox' && sizeKey !== 'xAuto' && sizeKey !== 'AutoxAuto') {
          allSizes[sizeKey] = (allSizes[sizeKey] || 0) + 1;
        }
        
        imageInfo[pageName].sections[sectionName].push({
          src,
          alt,
          width: finalWidth,
          height: finalHeight,
          className: img.attr('class') || 'No class'
        });
      });
      
      // Process background images
      $('[style*="background-image"]').each((index, element) => {
        const el = $(element);
        const style = el.attr('style');
        const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
        
        if (bgMatch) {
          const src = bgMatch[1];
          const width = el.attr('width') || 'Auto';
          const height = el.attr('height') || 'Auto';
          
          // Find the closest section or container
          let sectionName = 'Background Images';
          const section = el.closest('section, div[class*="section"], div[class*="container"]');
          if (section.length) {
            sectionName = section.attr('class') || 'Unnamed Section';
            const heading = section.find('h1, h2, h3, h4, h5, h6').first().text().trim();
            if (heading) {
              sectionName = heading;
            }
          }
          
          if (!imageInfo[pageName].sections[sectionName]) {
            imageInfo[pageName].sections[sectionName] = [];
          }
          
          // Try to get dimensions from style or classes
          let cssWidth = null;
          let cssHeight = null;
          
          // Check if element has width/height in its style
          const widthMatch = style.match(/width:\s*(\d+)px/);
          const heightMatch = style.match(/height:\s*(\d+)px/);
          
          if (widthMatch) cssWidth = widthMatch[1];
          if (heightMatch) cssHeight = heightMatch[1];
          
          // No longer using element width/height as it's not available in cheerio
          const finalWidth = width !== 'Auto' ? width : (cssWidth || 'Auto');
          const finalHeight = height !== 'Auto' ? height : (cssHeight || 'Auto');
          
          // Track all sizes for analysis
          const sizeKey = `${finalWidth}x${finalHeight}`;
          if (sizeKey !== 'Autox' && sizeKey !== 'xAuto' && sizeKey !== 'AutoxAuto') {
            allSizes[sizeKey] = (allSizes[sizeKey] || 0) + 1;
          }
          
          imageInfo[pageName].sections[sectionName].push({
            src,
            alt: 'Background Image',
            width: finalWidth,
            height: finalHeight,
            className: el.attr('class') || 'No class',
            type: 'Background'
          });
        }
      });
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }
  
  // Find common/standard sizes
  const sortedSizes = Object.entries(allSizes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  return { imageInfo, commonSizes: sortedSizes };
}

// Generate markdown file
function generateMarkdown(imageData) {
  const { imageInfo, commonSizes } = imageData;
  let md = '# Image Dimensions Guide\n\n';
  
  md += '## Common Image Sizes\n\n';
  md += 'These are the most frequently used image dimensions across the site:\n\n';
  md += '| Dimensions | Frequency |\n';
  md += '|------------|----------:|\n';
  
  commonSizes.forEach(([size, count]) => {
    md += `| ${size} | ${count} |\n`;
  });
  
  md += '\n## Pages and Sections\n\n';
  
  for (const [pageName, pageInfo] of Object.entries(imageInfo)) {
    md += `### ${pageName}\n\n`;
    
    for (const [sectionName, images] of Object.entries(pageInfo.sections)) {
      if (images.length > 0) {
        md += `#### ${sectionName}\n\n`;
        md += '| Image | Width | Height | Class |\n';
        md += '|-------|-------|--------|-------|\n';
        
        images.forEach(img => {
          const imgName = path.basename(img.src);
          md += `| ${imgName} (${img.alt}) | ${img.width} | ${img.height} | ${img.className} |\n`;
        });
        
        md += '\n';
      }
    }
  }
  
  md += '\n## Recommendations for Standardization\n\n';
  md += 'Based on the analysis of image dimensions across the site, here are recommendations for standardizing image sizes:\n\n';
  
  if (commonSizes.length > 0) {
    md += '### Hero/Banner Images\n';
    md += `- Recommended size: ${commonSizes[0][0]}\n\n`;
  }
  
  if (commonSizes.length > 1) {
    md += '### Content Images\n';
    md += `- Recommended size: ${commonSizes[1][0]}\n\n`;
  }
  
  if (commonSizes.length > 2) {
    md += '### Thumbnail Images\n';
    md += `- Recommended size: ${commonSizes[2][0]}\n\n`;
  }
  
  md += '### General Recommendations\n';
  md += '- Use responsive images with srcset where possible\n';
  md += '- Maintain aspect ratios when resizing images\n';
  md += '- Optimize all images for web (compress without quality loss)\n';
  
  return md;
}

// Main execution
(async function() {
  try {
    console.log('Finding HTML files...');
    const htmlFiles = findHtmlFiles(htmlDir);
    console.log(`Found ${htmlFiles.length} HTML files.`);
    
    console.log('Extracting image information...');
    const imageData = await extractImageInfo(htmlFiles);
    
    console.log('Generating markdown report...');
    const md = generateMarkdown(imageData);
    
    fs.writeFileSync(outputFile, md);
    console.log(`Report generated: ${outputFile}`);
  } catch (error) {
    console.error('Error:', error);
  }
})(); 