import { toAbsPath, viteDevServer } from "../init/viteDevServer";

let loadTemplate = () => import("../../views/index/template.marko");

const devTemplatePath = toAbsPath(loadTemplate);
console.log(toAbsPath(loadTemplate));

export async function resolveContent(req, res, next) {
  try {
    if (viteDevServer) {
      loadTemplate = () => viteDevServer.ssrLoadModule(devTemplatePath);
    }
    const template = (await loadTemplate()).default;
    const viewModel = {};
    template.renderToString(viewModel, (err, html) => {
      if (err) {
        viteDevServer?.ssrFixStacktrace(err);
        next(err);
      } else {
        res.send(html);
      }
    });
  } catch (e) {
    viteDevServer?.ssrFixStacktrace(e);
    console.log(e.stack); // eslint-disable-line
    res.status(500).end(e.stack);
  }
}
