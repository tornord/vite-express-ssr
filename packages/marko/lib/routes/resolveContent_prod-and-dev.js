import { loadTemplate, viteDevServer } from "../init/viteDevServer";

let templateImporter = () => import("../../views/index/template.marko");

export async function resolveContent(req, res, next) {
  try {
    const template = await loadTemplate(templateImporter);
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
