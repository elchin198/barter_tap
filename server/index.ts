import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { setupWebSocketServer } from './websocket.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

// ==================== WEBVIEW COMPATIBILITY ====================
// WebView uyumluluğu üçün HEADERS əlavə et
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src * ws: wss:; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'self';");
  next();
});

// ==================== STATIC FILES ====================
// WebView və frontend üçün vacib: dist/client və ya public qovluğundan oxusun
app.use(express.static(path.join(__dirname, '../../dist/client')));
app.use(express.static(path.join(__dirname, '../../public')));

// ==================== HEALTHCHECK ====================
app.get('/api/healthcheck', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'BarterTap serveri işləyir',
    timestamp: new Date().toISOString()
  });
});

// ==================== CATCH-ALL: SPA ROUTING ====================
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint tapılmadı' });
  }

  const indexPath = path.join(__dirname, '../../dist/client/index.html');
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`❌ index.html tapılmadı: ${indexPath}`, err);
      return res.status(500).send('İndeks faylı tapılmadı.');
    }
    res.sendFile(indexPath);
  });
});

// ==================== WEBSOCKET SETUP ====================
try {
  setupWebSocketServer(server);
  console.log("✅ WebSocket serveri uğurla başladı");
} catch (error) {
  console.error("🧨 WebSocket serveri başlatmaq mümkün olmadı:", error);
}

// ==================== ERROR HANDLING ====================
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("⚠️ Server error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ==================== START SERVER ====================
const port = parseInt(process.env.PORT || "5000", 10);
const host = "0.0.0.0";

server.listen(port, host, () => {
  const publicURL = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  console.log(`=====================================================`);
  console.log(`🚀 Server işləyir: http://${host}:${port}`);
  console.log(`🌐 Public URL: ${publicURL}`);
  console.log(`📱 WebSocket: ws://${host}:${port}`);
  console.log(`🧪 Test səhifəsi: ${publicURL}/test.html`);
  console.log(`=====================================================`);
});
