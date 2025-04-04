
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";
import tsconfigPaths from "vite-tsconfig-paths";
import themeShadcnJson from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorModal from "@replit/vite-plugin-runtime-error-modal";
import path from "path";
import { fileURLToPath } from "url";

// Convert URL to file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    (removeConsole as any).default?.(),
    themeShadcnJson(),
    runtimeErrorModal()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@components": path.resolve(__dirname, "./client/src/components"),
      "@pages": path.resolve(__dirname, "./client/src/pages"),
      "@hooks": path.resolve(__dirname, "./client/src/hooks"),
      "@utils": path.resolve(__dirname, "./client/src/utils"),
      "@styles": path.resolve(__dirname, "./client/src/styles"),
      "@assets": path.resolve(__dirname, "./client/src/assets"),
      "images": "/images"
    }
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
    assetsInlineLimit: 0,
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  },
  publicDir: "public",
  server: {
    host: "0.0.0.0",        // 💡 WebView və preview üçün bu **şərtdir**
    port: 3000,             // 💡 Vite dev server portu
    strictPort: true,       // WebView üçün port məcburi edir
    hmr: {
      host: "localhost"     // Hot Module Replacement host
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",   // ✅ backend port
        changeOrigin: true
      },
      "/locales": {
        target: "http://localhost:5000",
        changeOrigin: true
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true
      },
      "/ws": {
        target: "ws://localhost:5000",
        ws: true,
        changeOrigin: true
      }
    }
  }
});
