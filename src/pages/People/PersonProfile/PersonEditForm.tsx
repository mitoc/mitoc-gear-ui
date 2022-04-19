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
      <label className="mb-2 w-100">
        First name: <TextField value={firstName} onChange={setFirstName} />
      </label>
      <label className="mb-2 w-100">
        Last name: <TextField value={lastName} onChange={setLastName} />
      </label>
      <label className="mb-2 w-100">
        Email: <TextField value={email} onChange={setEmail} />
      </label>
      <div className="d-flex justify-content-between mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={closeForm}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            editPerson(person.id, firstName, lastName, email).then(() => {
              closeForm();
              refreshPerson();
            });
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
}