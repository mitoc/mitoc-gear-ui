import { useEffect, useState } from "react";
import Select from "react-select";
import { useForm, FormProvider } from "react-hook-form";

import { useGetGearTypesQuery } from "features/api";
import { CreateGearArgs, GearType } from "apiClient/gear";
import { LabeledInput } from "components/Inputs/LabeledInput";

export function AddNewGearForm({
  onSubmit,
}: {
  onSubmit: (args: CreateGearArgs) => void;
}) {
  const { data: gearTypes } = useGetGearTypesQuery();

  const [gearType, setGearType] = useState<
    (GearType & { value: string; label: string }) | null
  >(null);

  const formObject = useForm({
    defaultValues: {
      specification: "",
      size: "",
      description: "",
      idSuffix: "",
      autoGenerateIds: true,
      depositAmount: null,
      quantity: 1,
    },
  });

  const { handleSubmit, watch, setValue } = formObject;

  const autoGenerateIds = watch("autoGenerateIds");
  useEffect(() => {
    if (autoGenerateIds) {
      setValue("idSuffix", "");
    }
  }, [autoGenerateIds]);
  useEffect(() => {
    if (!autoGenerateIds && gearType) {
      setValue("idSuffix", gearType.shorthand + "-");
    }
  }, [autoGenerateIds, gearType]);

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
            type: gearType.value,
          });
        })}
      >
        <label className="w-100 mb-2">
          Gear type:
          <Select
            options={options}
            className="w-100"
            value={gearType}
            onChange={setGearType}
          />
        </label>
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
            name="idSuffix"
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
          name="deposit"
          options={{
            required: true,
            valueAsNumber: true,
          }}
        />

        <LabeledInput title="Specification:" type="text" name="specification" />
        <LabeledInput title="Size:" type="text" name="size" />
        <LabeledInput title="Description:" as="textarea" name="description" />
        <div className="d-flex justify-content-end w-100">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
