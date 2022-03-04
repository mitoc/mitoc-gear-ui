import { useState } from "react";

type Props = {};

export function MoreGear() {
  const [query, setQuery] = useState<string>("");
  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3>Rent more gear</h3>
      <input
        className="form-control"
        type="text"
        value={query}
        onChange={(evt) => {
          setQuery(evt.target.value);
        }}
      />
    </div>
  );
}
