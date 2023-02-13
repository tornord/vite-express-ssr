import config from "exp-config";
import express from "express";
// import expressWinston from "express-winston";
import fs from "node:fs";
import { join, resolve } from "node:path";

// import http from "http";
// import https from "https";
// import markoMiddleware from "@marko/express";
import { createServer as createViteServer } from "vite";

import logger from "./lib/logger.js";
import setupApp from "./lib/init/setupApp.js";

const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 3000;

const packageInfo = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const publicCat = resolve(".", "public", "static");
// console.log("setupApp",isProd)

(async () => {
  const app = setupApp();

  if (isProd) {
    app
      .use("/assets", express.static(join(publicCat, "assets"))) // Serve assets generated from vite.
      // .use(fs.readdirSync("./dist"));
  } else {
    const devServer = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(devServer.middlewares);
    app.use(async (req, res, next) =>
      (await devServer.ssrLoadModule("./lib/index")).default(req, res, (err) => {
        if (err) {
          devServer.ssrFixStacktrace(err);
          next(err);
        } else {
          next();
        }
      })
    );
  }

  const server = app.listen(port, (err) => {
    if (err) {
      throw err;
    }

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
})();
