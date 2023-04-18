import { defineConfig } from "vite";
import marko from "@marko/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    marko({
      babelConfig: { presets: ["@babel/preset-env"] },
      linked: false,
      include: "view/**/*.marko",
    }),
    react({ include: ["src/**/*.jsx"] }),
    myPlugin(),
  ],
  build: {
    ssr: true,
    outDir: "dist",
    emptyOutDir: false,
  },
});

function myPlugin() {
  return {
    name: "myPlugin",
    transform(src, id) {
      // console.log("transform", src.length, id);
      // return null;
    },
    transformIndexHtml(html) {
      // console.log("transformIndexHtml", html);
    },
    buildStart(options) {
      // console.log("buildStart", options);
    },
    resolveDynamicImport(specifier, importer) {
      console.log("resolveDynamicImport", specifier, importer);
    },
    // configResolved(resolvedConfig) {
    //   console.log("resolvedConfig", resolvedConfig, resolvedConfig.assetsInclude("src/entry-client.jsx"));
    // },
  };
}
