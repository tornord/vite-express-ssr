import template from "../../views/index/template.marko";

export async function resolveContent(req, res, next) {
  try {
    const viewModel = {};
    template.renderToString(viewModel, (err, html) => {
      if (err) {
        next(err);
      } else {
        res.send(html);
      }
    });
  } catch (e) {
    console.log(e.stack); // eslint-disable-line
    res.status(500).end(e.stack);
  }
}
