import ReactDOMServer from "react-dom/server";
import { App } from "./App";

export function render(url, context) {
  return ReactDOMServer.renderToString(<App />);
}
// <StaticRouter location={url} context={context}>
// </StaticRouter>
