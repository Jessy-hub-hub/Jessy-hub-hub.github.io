import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/",
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
    legalComments: "none", // Reduces extra comments that could trigger eval-like behaviors
  },
  optimizeDeps: {
    esbuildOptions: {
      minifyIdentifiers: true, // Avoids unnecessary code injection
    },
  },
});
