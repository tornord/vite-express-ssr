import fs from "node:fs";
import { resolve } from "node:path";

const isProd = process.env.NODE_ENV === "production";
const indexProd = isProd ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8") : "";
let viteDevServer = null;

export function setViteDevServer(v) {
  viteDevServer = v;
}

export async function resolveContent(req, res) {
  try {
    const url = req.originalUrl;

    let template, render;
    if (!isProd) {
      // always read fresh template in dev
      template = fs.readFileSync(resolve("./index.html"), "utf-8");
      template = await viteDevServer.transformIndexHtml(url, template);
      render = (await viteDevServer.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = indexProd;
      // @ts-ignore
      render = (await import("../../dist/server/entry-server.js")).render;
    }

    const context = {};
    const appHtml = render(url, context);

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      return res.redirect(301, context.url);
    }

    const html = template.replace("<!--app-html-->", appHtml);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    if (!isProd && viteDevServer) {
      viteDevServer.ssrFixStacktrace(e);
    }
    console.log(e.stack); // eslint-disable-line
    res.status(500).end(e.stack);
  }
}
