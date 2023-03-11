import { resolveContent, setViteDevServer } from "./lib/routes/resolveContent";
import config from "exp-config";
import { createServer as createViteDevServer } from "vite";
import { fileURLToPath } from "url";
import fs from "node:fs";
import logger from "./lib/logger.js";
import process from "process";
import { resolve } from "node:path";
import setupApp from "./lib/init/setupApp.js";

const packageInfo = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const app = setupApp();
let isTest = true;

async function main() {
  const isProd = process.env.NODE_ENV === "production";
  const port = Number(process.env.PORT) || 3000;

  let devServer;
  if (!isProd) {
    devServer = await createViteDevServer({
      root: process.cwd(),
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: { port: 5174 },
      },
      appType: "custom",
    });
    // use vite's connect instance as middleware
    app.use(devServer.middlewares);
    setViteDevServer(devServer);
  } else {
    app.use((await import("compression")).default());
    app.use(
      (await import("serve-static")).default(resolve("dist/client"), {
        index: false,
      })
    );
  }

  app.use("*", resolveContent);

  const server = app.listen(port, () => {
    logger.info(
      `%s ${config.REVISION ? `(revision=${config.REVISION}) ` : ""}listening on port %d`,
      packageInfo.name,
      server.address().port
    );
  });

  const exitRouter = (options, exitCode) => {
    // eslint-disable-next-line no-console
    if (exitCode || exitCode === 0) console.log(`${exitCode === "SIGINT" ? "\n" : ""}Exit: ${exitCode}`);
    if (options.exit) process.exit(1); // eslint-disable-line no-process-exit
  };

  const exitHandler = (exitCode) => {
    server.close(exitCode);
  };

  const others = ["SIGINT", "SIGUSR1", "SIGUSR2", "SIGHUP", "uncaughtException", "SIGTERM"];
  others.forEach((eventType) => {
    process.on(eventType, exitRouter.bind(null, { exit: true }));
  });

  process.on("exit", exitHandler);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  isTest = false;
  main();
}
