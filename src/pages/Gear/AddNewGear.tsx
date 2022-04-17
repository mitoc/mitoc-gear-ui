import Select from "react-select";

import { useState } from "react";

import { useGetGearTypesQuery } from "features/api";

import { Checkbox } from "components/Inputs/Checkbox";
import { NumberField } from "components/Inputs/NumberField";
import { TextField } from "components/Inputs/TextField";
import { TextArea } from "components/Inputs/TextArea";

export function AddNewGear() {
  const [gearType, setGearType] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number | null>(1);
  const [depositAmount, setDepositAmount] = useState<number | null>(null);
  const [autoGenerateIds, setAutoGenerateIds] = useState<boolean>(true);
  const [idSuffix, setIdSuffix] = useState<string>("");
  const [spec, setSpec] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { data: gearTypes } = useGetGearTypesQuery();
  const options =
    gearTypes?.map(({ id, typeName }) => ({
      value: id,
      label: typeName,
    })) ?? [];
  return (
    <div className="row">
      <div className="col-lg-8">
        <h1>Add new gear</h1>
        <form>
          <label className="w-100 mb-2">
            Gear type:
            <Select
              options={options}
              className="w-100"
              value={gearType}
              onChange={setGearType}
            />
          </label>
          <label className="w-100 mb-2">
            Quantity to add:
            <NumberField
              integer={true}
              value={quantity}
              onChange={setQuantity}
            />
          </label>
          <label className="mb-2 form-switch">
            <Checkbox value={autoGenerateIds} onChange={setAutoGenerateIds} />{" "}
            Automatically generate new ids
          </label>
          {!autoGenerateIds && (
            <label className="mb-2 w-100">
              First ID:
              {/* TODO: Validate this */}
              <TextField
                value={"AA-" + idSuffix}
                onChange={(val) => {
                  const suffix = val.slice(3);
                  setIdSuffix(suffix);
                }}
              />
            </label>
          )}
          <label className="mb-2 w-100">
            Deposit amount:
            <NumberField
              className="w-100"
              value={depositAmount}
              onChange={setDepositAmount}
            />
          </label>
          <label className="mb-2 w-100">
            Specification:
            <TextField value={spec} onChange={setSpec} />
          </label>
          <label className="mb-2 w-100">
            Size:
            <TextField value={size} onChange={setSize} />
          </label>
          <label className="mb-2 w-100">
            Description:
            <TextArea
              className="w-100"
              value={description}
              onChange={setDescription}
            />
          </label>
          <div className="d-flex justify-content-end w-100">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {}}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
