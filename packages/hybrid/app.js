import { readFileSync } from "fs";
import config from "exp-config";
import { fileURLToPath } from "url";
import logger from "./lib/logger.js";
import process from "process";
import { setupApp } from "./lib/init/setupApp.js";
import { setupViteDevServer } from "./lib/init/viteDevServer";
import { resolve } from "path";

process.env.MARKO_CONFIG = JSON.stringify({ writeToDisk: false });

const packageInfo = JSON.parse(readFileSync("./package.json", "utf-8"));
const app = setupApp();

async function main() {
  const port = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV === "development") {
    await setupViteDevServer(app);
  } else {
    app.use((await import("compression")).default());
    // app.use("/assets", express.static(join(publicCat, "assets"))); // Serve assets generated from vite.
    // .use(fs.readdirSync("./dist"));
    // app.use(
    //   (await import("serve-static")).default(resolve("dist/client"), {
    //     index: false,
    //   })
    // );
  }

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
  main();
}
