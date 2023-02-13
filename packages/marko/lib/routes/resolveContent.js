import fs from "node:fs";
import { resolve } from "node:path";

const isProd = process.env.NODE_ENV === "production";
let viteDevServer = null;

export function setViteDevServer(v) {
  viteDevServer = v;
}

export async function resolveContent(req, res, next) {
  try {
    const url = req.originalUrl;

    let template, render;
    if (!isProd) {
      // always read fresh template in dev
      // template = fs.readFileSync(resolve("./index.html"), "utf-8");
      // template = await viteDevServer.transformIndexHtml(url, template);
      template = (await viteDevServer.ssrLoadModule("./lib/index")).default;
      template(req, res, (err) => {
        if (err) {
          viteDevServer.ssrFixStacktrace(err);
          next(err);
        } else {
          next();
        }
      });
    } else {
      template = (await import("../../views")).default;
      template({}, res);
    }

    // const context = {};

    // if (context.url) {
    //   return res.redirect(301, context.url);
    // }

  } catch (e) {
    if (!isProd && viteDevServer) {
      viteDevServer.ssrFixStacktrace(e);
    }
    console.log(e.stack); // eslint-disable-line
    res.status(500).end(e.stack);
  }
}
