import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/", // Ensures correct base path
  plugins: [react(), svgr()],
  server: {
    port: 3000,
    proxy: {
      "/graphql": {
        target: "https://rugurujane.xyz/backend",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "docs",
    sourcemap: false,
  },
  esbuild: {
    legalComments: "none",
  },
  optimizeDeps: {
    esbuildOptions: {
      minifyIdentifiers: true,
    },
  },
  // 🔥 Fix refresh issue for React Router
  resolve: {
    alias: {
      react: "react",
    },
  },
  define: {
    "process.env": {},
  },
});
