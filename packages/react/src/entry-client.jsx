import ReactDOM from "react-dom/client";
import { App } from "./App";

ReactDOM.hydrateRoot(document.getElementById("root"), <App />);
console.log("React hydrated!");
