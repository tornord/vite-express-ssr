import react from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

ReactDOM.hydrateRoot(document.getElementById("react-root"), <App />);
console.log("React hydrated!");
