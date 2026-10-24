import { useState } from "react";

import { addMitocCredit, Person } from "src/apiClient/people";
import { NumberField } from "src/components/Inputs/NumberField";
import { TagType } from "src/redux/api";
import { invalidateCache } from "src/redux/store";

type Props = {
  person: Person;
  onClose: () => void;
};

export function MitocCreditForm({ person, onClose }: Props) {
  const [amount, setAmount] = useState<number | null>(15);
  const [note, setNote] = useState("");
  const isValid = !!amount && note.trim().length > 0;
  return (
    <div>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          if (!isValid) {
            return;
          }
          addMitocCredit(person.id, amount, note.trim()).then(() => {
            invalidateCache([TagType.People]);
            onClose();
          });
        }}
      >
        <label className="mb-2">
          Credit to add ($):
          <NumberField value={amount} onChange={setAmount} />
        </label>
        <br />
        <label className="mb-2 w-100">
          Reason:
          <textarea
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            required
          />
        </label>
        <br />
        <button className="btn btn-primary" type="submit" disabled={!isValid}>
          Add credit
        </button>
        <br />
      </form>
    </div>
  );
}
