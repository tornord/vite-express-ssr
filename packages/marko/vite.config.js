import { defineConfig } from "vite";
import marko from "@marko/vite";

export default defineConfig({
  plugins: [marko()], // marko({ linked: false })
  build: {
    outDir: "dist",
    // publicDir: "assets",
  },
});
