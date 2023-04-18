import react from "react";
import { Hello } from "./Hello";
import { Counter } from "./Counter";

export function App({ viewModel }) {
  return (
    <div class="app">
      <Hello text={viewModel.text} />
      <Counter />
      <script></script>
    </div>
  );
}
