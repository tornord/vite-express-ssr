import { useState } from "react";

export function Counter({ viewModel }) {
  console.log("Counter", viewModel);
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((n) => n + 1)}>Inc</button>
      <button onClick={() => setCount((n) => n - 1)}>Dec</button>
    </div>
  );
}
