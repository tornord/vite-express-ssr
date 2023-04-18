import { defineConfig } from "vitest/config";
import marko from "@marko/vite";

export default defineConfig({
  plugins: [marko()],
  test: {
    include: ["test/**/*.js"],
    globals: true,
    transformMode: { ssr: [/\.([cm]?[jt]sx?|json|marko)$/] },
    // browser: false
  },
});
