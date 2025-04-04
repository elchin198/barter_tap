// A simplified server to check connectivity issues
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// MIME tipi düzəlişi - JS modulları üçün düzgün MIME tipləri təyin edir
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.url.endsWith('.mjs')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});

// Serve static files with proper MIME types
const publicDir = path.join(__dirname, 'dist', 'public');
app.use(express.static(publicDir, {
  setHeaders: (res, filePath) => {
    // JS faylları üçün düzgün MIME tipi təyin et
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.get('/api/healthcheck', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(publicDir, 'index.html'));
  }
});

// Start server (Render.com üçün PORT mühit dəyişənini istifadə et)
const port = process.env.PORT || 10000;
server.listen(port, '0.0.0.0', () => {
  // console.log(`Simplified server running on port ${port}`);
});