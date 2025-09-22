import { useState } from "react";

import { addMitocCredit, Person } from "src/apiClient/people";
import { NumberField } from "src/components/Inputs/NumberField";
import { invalidateCache } from "src/redux/store";

type Props = {
  person: Person;
  onClose: () => void;
};

export function MitocCreditForm({ person, onClose }: Props) {
  const [amount, setAmount] = useState<number | null>(15);
  return (
    <div>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          if (!amount) {
            return;
          }
          addMitocCredit(person.id, amount).then(() => {
            invalidateCache(["People"]);
            onClose();
          });
        }}
      >
        <label className="mb-2">
          Credit to add ($):
          <NumberField value={amount} onChange={setAmount} />
        </label>
        <br />
        <button className="btn btn-primary" type="submit" disabled={!amount}>
          Add credit
        </button>
        <br />
      </form>
    </div>
  );
}
