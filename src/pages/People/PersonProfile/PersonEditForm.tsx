import { editPerson, Person } from "apiClient/people";
import { TextField } from "components/Inputs/TextField";
import { useState } from "react";

type Props = {
  person: Person;
  closeForm: () => void;
  refreshPerson: () => void;
};

export function PersonEditForm({ person, closeForm, refreshPerson }: Props) {
  const [firstName, setFirstName] = useState<string>(person.firstName);
  const [lastName, setLastName] = useState<string>(person.lastName);
  const [email, setEmail] = useState<string>(person.email);
  return (
    <form>
      <label className="form-group w-100">
        First name: <TextField value={firstName} onChange={setFirstName} />
      </label>
      <label className="form-group w-100">
        Last name: <TextField value={lastName} onChange={setLastName} />
      </label>
      <label className="form-group w-100">
        Email: <TextField value={email} onChange={setEmail} />
      </label>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={closeForm}
      >
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => {
          editPerson(person.id, firstName, lastName, email).then(() => {
            closeForm();
            refreshPerson();
          });
        }}
      >
        Confirm
      </button>
    </form>
  );
}
