import Select from "react-select";

import { useEffect, useState } from "react";

import { useGetGearTypesQuery } from "features/api";

import { Checkbox } from "components/Inputs/Checkbox";
import { NumberField } from "components/Inputs/NumberField";
import { TextField } from "components/Inputs/TextField";
import { TextArea } from "components/Inputs/TextArea";
import { createGear, GearSummary, GearType } from "apiClient/gear";
import { isEmpty } from "lodash";
import { GearLink } from "components/GearLink";
import { Link } from "react-router-dom";

export function AddNewGear() {
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

  const [gearCreated, setGearCreated] = useState<GearSummary[]>([]);

  useEffect(() => {
    if (!autoGenerateIds) {
      setIdSuffix("");
    }
  }, [autoGenerateIds]);

  const onSubmit = () => {
    if (gearType == null || !quantity) {
      return;
    }
    createGear({
      type: gearType.value,
      quantity,
      idSuffix,
      specification: spec,
      size,
    }).then(({ items }) => setGearCreated(items));
  };
  const options =
    gearTypes?.map((gearType) => ({
      value: gearType.id,
      label: gearType.typeName,
      ...gearType,
    })) ?? [];

  if (!isEmpty(gearCreated)) {
    return (
      <div className="row">
        <div className="col-lg-8">
          <h1>Add new gear</h1>
          <p className="mb-2">Success! The following items were created:</p>
          <ul className="list-group mb-3">
            {gearCreated.map((item) => {
              return (
                <li key={item.id} className="list-group-item">
                  <GearLink id={item.id}>{item.id}</GearLink>
                </li>
              );
            })}
          </ul>
          <div className="d-flex justify-content-between">
            <Link to="/gear">
              <button type="button" className="btn btn-outline-secondary">
                Back to gear list
              </button>
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setGearCreated([])}
            >
              Add more gear
            </button>
          </div>
        </div>
      </div>
    );
  }
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
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
