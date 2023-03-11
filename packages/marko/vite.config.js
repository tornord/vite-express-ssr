import { defineConfig } from "vite";
import marko from "@marko/vite";

export default defineConfig({
  plugins: [
    marko({
      babelConfig: { presets: ["@babel/preset-env"] },
      linked: false,
    }),
  ],
  build: {
    outDir: "dist",
    // publicDir: "assets",
  },
});
