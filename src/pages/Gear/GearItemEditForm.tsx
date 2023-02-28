import { editGearItem, GearSummary } from "apiClient/gear";
import { NumberField } from "components/Inputs/NumberField";
import { TextArea } from "components/Inputs/TextArea";
import { TextField } from "components/Inputs/TextField";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { useState } from "react";
import Select from "react-select";
import { useGetGearLocationsQuery } from "redux/api";


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
  const { data: gearLocations } = useGetGearLocationsQuery();
  const optionsGearLocations = 
    gearLocations?.map((gearLocation) => ({
      value: gearLocation.id,
      label: gearLocation.shorthand,
      ...gearLocation
    })) ?? [];

  const onSubmit = () => {
    setSubmitted(true);
    if (deposit == null) {
      return;
    }
    editGearItem(gearItem.id, specification, description, size, deposit, 1).then(      () => {
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

      <LabeledInput
        title="Gear location (override):"
        name="location"
        renderComponent={({ value, onChange, onBlur, invalid }: any) => {
          return (
            <Select
              isLoading={!gearLocations}
              options={optionsGearLocations}
              className={`w-100 ${invalid ? "is-invalid" : ""}`}
              styles={{
                control: (base, state) =>
                  !invalid
                    ? base
                    : {
                        ...base,
                        ...invalidFormControlStyle,
                      },
              }}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          );
        }}
      />

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

// This is copy-pasted from bootstrap, since we can't set the inner class of React-Select
const invalidFormControlStyle = {
  borderColor: "#dc3545",
  paddingRight: "calc(1.5em + .75rem)",
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right calc(.375em + .1875rem) center",
  backgroundSize: "calc(.75em + .375rem) calc(.75em + .375rem)",
};
