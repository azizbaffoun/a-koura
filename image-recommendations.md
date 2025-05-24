# Sports Vision Website Image Dimensions Guide

## Page-by-Page Image Specifications

### Home Page
- **Logo**: 180px × 30px (width may vary but height should be exactly 30px)
- **Menu/Navigation Icons**: 24px × 16px (icons should be consistent size)
- **Hero Banner**: 1920px × 900px (responsive full-width)
- **Featured News Images**: 400px × 300px 
- **Match Announcement Images**: 800px × 500px
- **Background Decorations**: 1920px × 1080px minimum
- **Partner/Sponsor Logos**: 140px × 70px (width fixed, height may vary but approximately half of width)
- **Feature Icons**: 32px × 32px
- **Social Media Icons**: 24px × 24px

### About Us Page
- **Section Banner**: 1400px × 600px
- **Team Member Photos**: 271px × 281px
- **About Us Background Photo**: 1400px × 800px
- **Play Button Icon**: 48px × 48px (SVG preferred)

### Team Page
- **Team Group Photos**: 800px × 600px
- **Team Logos**: 140px × 140px (square format with transparent background)
- **Player Portraits (thumbnail)**: 271px × 281px

### Player Details Page
- **Player Portraits (large)**: 500px × 650px
- **Match Action Shots**: 800px × 600px

### Gallery Page
- **Gallery Images**: 800px × 600px (maintain consistent aspect ratio)

### Videos Page
- **Video Thumbnails**: 1280px × 720px (16:9 ratio)
- **Play Button Icon**: 48px × 48px (SVG preferred)

### News/Blog Pages
- **Blog Header Image**: 1200px × 600px
- **Blog Thumbnail**: 400px × 300px
- **News Card Image**: 400px × 300px

### Store/Products Page
- **Product Display (large)**: 600px × 600px
- **Product Display (thumbnail)**: 250px × 250px
- **Product Detail Gallery**: 600px × 600px

## Technical Recommendations

### File Formats
- **Photos**: WEBP (primary), JPG (fallback)
- **Logos/Icons**: SVG (preferred) or PNG with transparency
- **Decorative Elements**: SVG or PNG with transparency

### Optimization Guidelines
- All images should be optimized for web (compress without quality loss)
- Maximum file size:
  - Hero images: 300KB max
  - Regular content images: 150KB max
  - Thumbnails: 50KB max
  - Icons/logos: 20KB max

### Responsive Image Strategy
- Provide multiple resolutions for key images:
  - Hero banners: 1920px, 1280px, 768px widths
  - Content images: 800px, 600px, 400px widths

### Background Images
- All background images should be at least 1920px wide
- Provide variations at 1920px, 1440px, and 768px widths

## Implementation Notes

1. **Maintain Aspect Ratios**: When resizing existing images, maintain the original aspect ratio to prevent distortion.

2. **Standardize Naming Convention**: Use descriptive file names following pattern: `[page]-[section]-[purpose]-[dimensions].webp`

3. **Quality Settings**:
   - WEBP: 80-90% quality
   - JPG: 85-95% quality
   - PNG: Use 8-bit where possible

4. **Important Note on "Auto" Dimensions**: 
   - When you see dimensions like "140px × 70px" where one dimension was previously "Auto", it means you should fix one dimension (width in this case) and scale the other proportionally to maintain the proper aspect ratio.
   - For logos, maintain the aspect ratio of the original logo while ensuring the fixed dimension (usually height) matches the spec.

5. **Image Alternatives**: Always provide descriptive alt text for accessibility 