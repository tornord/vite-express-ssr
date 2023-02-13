import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./testSetup.js",
  },
});
