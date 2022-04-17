import { useEffect, useState } from "react";
import Select from "react-select";
import { useForm, FormProvider, Controller } from "react-hook-form";

import { useGetGearTypesQuery } from "features/api";
import { CreateGearArgs, GearType } from "apiClient/gear";
import { LabeledInput } from "components/Inputs/LabeledInput";

type GearTypeOption = GearType & { value: string; label: string };

type FormValues = {
  gearType: GearTypeOption | null;
  specification: string;
  size: string;
  description: string;
  firstId: string;
  autoGenerateIds: boolean;
  depositAmount: number | null;
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

  const { handleSubmit, watch, setValue, control } = formObject;

  const autoGenerateIds = watch("autoGenerateIds");
  const gearType = watch("gearType");
  useEffect(() => {
    if (autoGenerateIds) {
      setValue("firstId", "");
    }
  }, [autoGenerateIds]);
  useEffect(() => {
    if (!autoGenerateIds && gearType) {
      setValue("firstId", gearType.shorthand + "-");
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
            id: formValues.firstId,
            type: gearType.value,
          });
        })}
      >
        <label className="w-100 mb-2">
          Gear type:
          <Controller
            control={control}
            name="gearType"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Select
                options={options}
                className="w-100"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
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
