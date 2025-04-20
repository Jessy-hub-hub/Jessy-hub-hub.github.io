import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: '/', // ✅ correct for GitHub Pages when repo is <username>.github.io
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
    outDir: "docs", // GitHub Pages expects this
  },
});
