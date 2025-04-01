import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/", // Ensure correct base path
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
    sourcemap: false, // Prevents eval() in source maps
  },
  esbuild: {
    legalComments: "none",
  },
  optimizeDeps: {
    esbuildOptions: {
      minifyIdentifiers: true,
    },
  },
  // 🔥 Fix for SPA refresh
  resolve: {
    alias: {
      react: "react",
    },
  },
  define: {
    "process.env": {},
  },
});
