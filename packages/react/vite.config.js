import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    myPlugin(),
    inspect({
      build: true,
      outputDir: ".vite-inspect",
    }),
  ],
  build: {
    minify: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./testSetup.js",
  },
});

function myPlugin() {
  return {
    name: "myPlugin",
    transform(src, id) {
      // console.log("transform", src.length, id);
      // return null;
    },
    configResolved(resolvedConfig) {
      // console.log("resolvedConfig", resolvedConfig, resolvedConfig.assetsInclude());
    },
    transformIndexHtml(html) {
      // console.log("transformIndexHtml", html);
    },
  };
}
