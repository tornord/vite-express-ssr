import { resolveContent, setViteDevServer } from "./lib/routes/resolveContent";
import express from "express";
import { resolve } from "node:path";

const PORT = 3001;
const isTest = process.env.VITEST;

export async function createServer(root = process.cwd(), hmrPort) {
  const isProd = process.env.NODE_ENV === "production";
  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
    setViteDevServer(vite);
  } else {
    app.use((await import("compression")).default());
    app.use(
      (await import("serve-static")).default(resolve("dist/client"), {
        index: false,
      })
    );
  }

  app.use("*", resolveContent);

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`); // eslint-disable-line
    })
  );
}
