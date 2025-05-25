const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;

// Serve static files from the html subdirectory
app.use(express.static(path.join(__dirname, 'html')));

// URL rewriting middleware for clean URLs (remove .html extension)
app.use((req, res, next) => {
  if (req.path.indexOf('.') === -1) {
    const filePath = path.join(__dirname, 'html', req.path + '.html');
    
    // Check if the file exists with .html extension
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (!err) {
        // File exists, serve it
        res.sendFile(filePath);
      } else {
        // No matching file, continue to next middleware
        next();
      }
    });
  } else {
    // Request already has an extension, continue to next middleware
    next();
  }
});

// Handle index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Access your pages without .html extension. For example:`);
  console.log(`  http://localhost:${port}/about-us   (instead of about-us.html)`);
  console.log(`  http://localhost:${port}/store      (instead of store.html)`);
}); 