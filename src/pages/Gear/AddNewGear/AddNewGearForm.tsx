import { useEffect, useState } from "react";
import Select from "react-select";

import { useGetGearTypesQuery } from "features/api";
import { Checkbox } from "components/Inputs/Checkbox";
import { NumberField } from "components/Inputs/NumberField";
import { TextField } from "components/Inputs/TextField";
import { TextArea } from "components/Inputs/TextArea";
import { CreateGearArgs, GearType } from "apiClient/gear";

export function AddNewGearForm({
  onSubmit,
}: {
  onSubmit: (args: CreateGearArgs) => void;
}) {
  const { data: gearTypes } = useGetGearTypesQuery();

  const [gearType, setGearType] = useState<
    (GearType & { value: string; label: string }) | null
  >(null);
  const [quantity, setQuantity] = useState<number | null>(1);
  const [depositAmount, setDepositAmount] = useState<number | null>(null);
  const [autoGenerateIds, setAutoGenerateIds] = useState<boolean>(true);
  const [idSuffix, setIdSuffix] = useState<string>("");
  const [spec, setSpec] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = () => {
    if (gearType == null || !quantity) {
      return null;
    }
    return onSubmit({
      type: gearType.value,
      quantity,
      idSuffix,
      specification: spec,
      size,
    });
  };

  const options =
    gearTypes?.map((gearType) => ({
      value: gearType.id,
      label: gearType.typeName,
      ...gearType,
    })) ?? [];

  useEffect(() => {
    if (autoGenerateIds) {
      setIdSuffix("");
    }
  }, [autoGenerateIds]);

  return (
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
        <NumberField integer={true} value={quantity} onChange={setQuantity} />
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
            value={gearType ? gearType?.shorthand + "-" + idSuffix : ""}
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
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
