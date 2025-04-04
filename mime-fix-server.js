// Bu server Render.com-da MIME tipləri problemi üçün spesifik olaraq yaradılıb
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Override the Content-Type header for all JS files
app.use((req, res, next) => {
  // Get the file extension
  const ext = path.extname(req.path).toLowerCase();

  // Only handle requests for JavaScript files
  if (ext === '.js') {
    // Set the MIME type explicitly
    res.type('application/javascript');
  } else if (ext === '.css') {
    res.type('text/css');
  } else if (ext === '.html') {
    res.type('text/html');
  }

  next();
});

// Serve static files with the correct MIME types
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    // Set MIME types explicitly based on file extension
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Check and output current MIME type configuration
app.get('/debug-mime', (req, res) => {
  const mimeTypes = express.static.mime.types;
  res.json({
    js: mimeTypes.js || 'not defined',
    css: mimeTypes.css || 'not defined',
    html: mimeTypes.html || 'not defined',
    all_mime_types: mimeTypes
  });
});

// Handle SPA routing (serve index.html for all routes except API routes)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/debug')) {
    // Make sure content type is set for index.html too
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    // console.log(`MIME-fixing server running on port ${PORT}`);

    try {
      const publicDir = path.join(__dirname, 'public');
      if (!fs.existsSync(publicDir)) {
        // Warning removed for production
      }
    } catch (err) {
      console.error('Error checking public directory:', err);
    }
  }
});