import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { useGetGearTypesQuery } from "redux/api";
import { CreateGearArgs, GearType } from "apiClient/gear";
import { makeLabeledInput } from "components/Inputs/LabeledInput";
import { Link } from "react-router-dom";
import { fmtAmount } from "lib/fmtNumber";
import { Select } from "components/Select";

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

const LabeledInput = makeLabeledInput<FormValues>();

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

  const { handleSubmit, watch, setValue, getFieldState } = formObject;

  const autoGenerateIds = watch("autoGenerateIds");
  const gearType = watch("gearType");
  const deposit = watch("depositAmount");
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

  useEffect(() => {
    const hasTouchedDeposit = getFieldState("depositAmount").isDirty;
    if (gearType && !hasTouchedDeposit) {
      setValue("depositAmount", gearType.defaultDeposit);
    }
  }, [getFieldState, setValue, gearType]);
  const options =
    gearTypes?.map((gearType) => ({
      value: String(gearType.id),
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
          renderComponent={({ value, onChange, onBlur, invalid }) => {
            return (
              <Select
                isLoading={!gearTypes}
                options={options}
                className="w-100"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                invalid={invalid}
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
            valueAsNumber: true,
          }}
        />
        {gearType != null && deposit !== gearType.defaultDeposit && (
          <div className="alert alert-warning p-1">
            You are about to override the deposit for this item. The default
            deposit for "{gearType.typeName}" is{" "}
            {fmtAmount(gearType.defaultDeposit)}. You can proceed if you think
            this item deserves a specific deposit, but keep in mind that it can
            confuse renters: this item's deposit will not match the one posted
            on the MITOC website.
          </div>
        )}

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
