import { loadTemplate, viteDevServer } from "../init/viteDevServer";

const reactImporter = () => import("../../src/entry-server.jsx");

// console.log(Counter);

let templateImporter = () => import("../../views/index/template.marko");

export async function resolveContent(req, res, next) {
  try {
    const { render } = await reactImporter();
    const reactHtml = render({ text: "Hello from React!" });
    const template = await loadTemplate(templateImporter);
    const viewModel = {};
    template.renderToString(viewModel, (err, html) => {
      if (err) {
        viteDevServer?.ssrFixStacktrace(err);
        next(err);
      } else {
        html = html.replace("<div id=react-root></div>", `<div id="react-root">${reactHtml}</div>`);
        res.send(html);
      }
    });
  } catch (e) {
    viteDevServer?.ssrFixStacktrace(e);
    console.log(e.stack); // eslint-disable-line
    res.status(500).end(e.stack);
  }
}
