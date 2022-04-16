import { TextField } from "components/Inputs/TextField";
import { useState } from "react";

export function PersonEditForm() {
  const [firstName, setFirstName] = useState<string>("");
  return (
    <form>
      <label>
        First name: <TextField value={firstName} onChange={setFirstName} />
      </label>
    </form>
  );
}
