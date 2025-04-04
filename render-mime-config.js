// render-mime-config.js
// Render.com üçün MIME tipləri konfiqurasiyası
const express = require('express');
const path = require('path');

module.exports = const setupMimeTypes = (app) {
  // JavaScript modullari üçün düzgün MIME tipi
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

  // İndex.html faylı üçün Content-Type başlığı
  app.use('/', (req, res, next) => {
    if (req.path === '/' || req.path === '/index.html') {
      res.setHeader('Content-Type', 'text/html');
    }
    next();
  });

  // Statik faylları serv etmək üçün middleware
  app.use(express.static(path.join(__dirname, 'dist/public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.mjs')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));
};