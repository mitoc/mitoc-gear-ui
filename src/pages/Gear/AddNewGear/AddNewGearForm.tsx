import { useEffect } from "react";
import Select from "react-select";
import { useForm, FormProvider } from "react-hook-form";

import { useGetGearTypesQuery } from "redux/api";
import { CreateGearArgs, GearType } from "apiClient/gear";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { Link } from "react-router-dom";

type GearTypeOption = GearType & { value: string; label: string };

type FormValues = {
  gearType: GearTypeOption | null;
  specification: string;
  size: string;
  description: string;
  firstId: string;
  autoGenerateIds: boolean;
  depositAmount?: number;
  quantity: number;
};

export function AddNewGearForm({
  onSubmit,
}: {
  onSubmit: (args: CreateGearArgs) => void;
}) {
  const { data: gearTypes } = useGetGearTypesQuery();

  const formObject = useForm<FormValues>({
    defaultValues: {
      autoGenerateIds: true,
      quantity: 1,
    },
  });

  const { handleSubmit, watch, setValue } = formObject;

  const autoGenerateIds = watch("autoGenerateIds");
  const gearType = watch("gearType");
  useEffect(() => {
    if (autoGenerateIds) {
      setValue("firstId", "");
    }
  }, [setValue, autoGenerateIds]);
  useEffect(() => {
    if (!autoGenerateIds && gearType) {
      setValue("firstId", gearType.shorthand + "-");
    }
  }, [setValue, autoGenerateIds, gearType]);

  const options =
    gearTypes?.map((gearType) => ({
      value: gearType.id,
      label: gearType.typeName,
      ...gearType,
    })) ?? [];

  return (
    <FormProvider {...formObject}>
      <form
        onSubmit={handleSubmit((formValues) => {
          if (gearType == null) {
            return null;
          }
          onSubmit({
            ...formValues,
            id: formValues.firstId,
            type: gearType.value,
          });
        })}
      >
        <LabeledInput
          title="Gear type:"
          name="gearType"
          renderComponent={({ value, onChange, onBlur, invalid }: any) => {
            return (
              <Select
                isLoading={!gearTypes}
                options={options}
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
          options={{
            required: true,
          }}
        />
        <LabeledInput
          title="Quantity to add:"
          type="number"
          name="quantity"
          options={{
            required: true,
            valueAsNumber: true,
          }}
        />
        <LabeledInput
          className="form-switch"
          title="Automatically generate new ids"
          type="checkbox"
          name="autoGenerateIds"
        />
        {!autoGenerateIds && (
          <LabeledInput
            title="First ID:"
            name="firstId"
            options={{
              required: true,
              pattern: {
                value: new RegExp(
                  "^" + (gearType?.shorthand ?? "[A-Z]{2}") + "-\\d{2}-\\d\\d+"
                ),
                message:
                  "ID must follow the pattern " +
                  (gearType?.shorthand ?? "XX") +
                  "-22-01",
              },
            }}
          />
        )}
        <LabeledInput
          title="Deposit amount:"
          type="number"
          step={0.5}
          name="depositAmount"
          options={{
            required: true,
            valueAsNumber: true,
          }}
        />

        <LabeledInput
          placeholder="Ex: MSR Elixir 2"
          title="Specification:"
          type="text"
          name="specification"
        />
        <LabeledInput
          placeholder="Ex: 2p"
          title="Size:"
          type="text"
          name="size"
        />
        <LabeledInput
          placeholder={exampleDescription}
          title="Description:"
          as="textarea"
          name="description"
        />
        <div className="d-flex justify-content-between mb-3">
          <Link to="/gear">
            <button type="button" className="btn btn-outline-secondary">
              Cancel
            </button>
          </Link>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
const exampleDescription = [
  "Ex: Includes: tent body, rain fly, footprint, 2 poles, stakes, carrying case.",
  "Tents must be set up and inspected when returned",
].join("\n");

// This is copy-pasted from bootstrap, since we can't set the inner class of React-Select
const invalidFormControlStyle = {
  borderColor: "#dc3545",
  paddingRight: "calc(1.5em + .75rem)",
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right calc(.375em + .1875rem) center",
  backgroundSize: "calc(.75em + .375rem) calc(.75em + .375rem)",
};
