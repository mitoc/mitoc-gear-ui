import { GearItem, GearSummary } from "apiClient/gear";
import { NumberField } from "components/Inputs/NumberField";
import { TextArea } from "components/Inputs/TextArea";
import { TextField } from "components/Inputs/TextField";
import { useState } from "react";

type Props = {
  gearItem: GearSummary;
  closeForm: () => void;
  refreshGearItem: () => void;
};

export function gearItemEditForm({
  gearItem,
  closeForm,
  refreshGearItem,
}: Props) {
  const [specification, setSpecification] = useState<string>(
    gearItem.specification
  );
  const [description, setDescription] = useState<string>(gearItem.description);
  const [size, setSize] = useState<string>(gearItem.size);
  const [deposit, setDeposit] = useState<number>(gearItem.depositAmount);
  return (
    <form>
      <label className="form-group w-100">
        Specification:{" "}
        <TextField value={specification} onChange={setSpecification} />
      </label>
      <label className="form-group w-100">
        Description: <TextArea value={description} onChange={setDescription} />
      </label>
      <label className="form-group w-100">
        Size: <TextField value={size} onChange={setSize} />
      </label>
      <label className="form-group w-100">
        Deposit: <NumberField number={deposit} onChange={setDeposit} />
      </label>
      {/* <button
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
      </button> */}
    </form>
  );
}
