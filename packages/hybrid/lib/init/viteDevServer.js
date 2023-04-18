import { createServer as createViteDevServer } from "vite";

export let viteDevServer = null;

export async function setupViteDevServer(app) {
  viteDevServer = await createViteDevServer({
    server: { middlewareMode: true },
    appType: "custom",
    hmr: { port: 5174 },
  });
  app.use(viteDevServer.middlewares);
}

export function toAbsPath(loadProdTemplateFun) {
  return String(loadProdTemplateFun).match(/import\("[./]*([\w\/]*\.marko)"\)/)?.[1] ?? "";
}

export function getTemplateLoader(srv, prodLoadFun) {
  return !srv ? prodLoadFun : () => srv.ssrLoadModule(toAbsPath(prodLoadFun));
}

// export async function loadTemplate(prodLoadFun) {
//   const res = await getTemplateLoader(viteDevServer, prodLoadFun)();
//   return "default" in res ? res.default : res;
// }

export async function loadTemplate(prodLoadFun) {
  // let prom;
  // if (viteDevServer) {
  //   prom = viteDevServer.ssrLoadModule(toAbsPath(prodLoadFun));
  // } else {
  //   prom = prodLoadFun();
  // }
  const res = await (viteDevServer ? viteDevServer.ssrLoadModule(toAbsPath(prodLoadFun)) : prodLoadFun());
  return "default" in res ? res.default : res;
}
