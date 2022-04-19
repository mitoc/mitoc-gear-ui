import { editGearItem, GearSummary } from "apiClient/gear";
import { NumberField } from "components/Inputs/NumberField";
import { TextArea } from "components/Inputs/TextArea";
import { TextField } from "components/Inputs/TextField";
import { useState } from "react";

type Props = {
  gearItem: GearSummary;
  closeForm: () => void;
  refreshGear: () => void;
};

export function GearItemEditForm({ gearItem, closeForm, refreshGear }: Props) {
  const [specification, setSpecification] = useState<string>(
    gearItem.specification ?? ""
  );
  const [description, setDescription] = useState<string>(
    gearItem.description ?? ""
  );
  const [size, setSize] = useState<string>(gearItem.size ?? "");
  const [deposit, setDeposit] = useState<number | null>(gearItem.depositAmount);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onSubmit = () => {
    setSubmitted(true);
    if (deposit == null) {
      return;
    }
    editGearItem(gearItem.id, specification, description, size, deposit).then(
      () => {
        closeForm();
        refreshGear();
      }
    );
  };
  return (
    <form>
      <label className="form-group w-100 mb-2">
        Specification:{" "}
        <TextField value={specification} onChange={setSpecification} />
      </label>
      <label className="form-group w-100 mb-2">
        Description:{" "}
        <TextArea
          className="w-100"
          value={description}
          onChange={setDescription}
        />
      </label>
      <label className="form-group w-100 mb-2">
        Size: <TextField value={size} onChange={setSize} />
      </label>
      <label className="form-group w-100 mb-2">
        Deposit:{" "}
        <NumberField
          value={deposit}
          onChange={setDeposit}
          className={deposit == null && submitted ? "is-invalid" : ""}
        />
        <div className="invalid-feedback">This field is required</div>
      </label>

      <div className="d-flex justify-content-between mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={closeForm}
        >
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </form>
  );
}
