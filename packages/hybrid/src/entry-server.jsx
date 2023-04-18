import ReactDOMServer from "react-dom/server";
import { App } from "./App";

export function render(viewModel) {
  return ReactDOMServer.renderToString(
    <App viewModel={viewModel} />
  );
}
// <StaticRouter location={url} context={context}>
// </StaticRouter>
