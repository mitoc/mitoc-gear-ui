import { useEffect, useState, InputHTMLAttributes } from "react";
import Select from "react-select";
import {
  useForm,
  FieldPath,
  FormProvider,
  useFormContext,
  RegisterOptions,
} from "react-hook-form";

import { useGetGearTypesQuery } from "features/api";
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

  const {
    register,
    handleSubmit: handleSubmit2,
    watch,
    setValue,
    formState: { errors },
  } = formObject;

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

  const handleSubmit = (args: any) => {
    console.log(args);
    // return onSubmit({
    //   type: gearType.value,
    //   quantity,
    //   idSuffix,
    //   specification: spec,
    //   size,
    // });
  };

  const options =
    gearTypes?.map((gearType) => ({
      value: gearType.id,
      label: gearType.typeName,
      ...gearType,
    })) ?? [];

  return (
    <FormProvider {...formObject}>
      <form onSubmit={handleSubmit2(handleSubmit)}>
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
        <label className="mb-2 form-switch">
          <input
            type="checkbox"
            className={`form-check-input ${""}`}
            {...register("autoGenerateIds")}
          />{" "}
          Automatically generate new ids
        </label>
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
                  "-NN-NN",
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

        <LabeledInput title="Specification:" name="specification" />
        <LabeledInput title="Size:" name="size" />

        <label className="mb-2 w-100">
          Description:
          <textarea className="form-control" {...register("description")} />
        </label>
        <div className="d-flex justify-content-end w-100">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function LabeledInput<TFieldValues>(
  props: InputProps & {
    name: FieldPath<TFieldValues>;
    title: string;
    options?: RegisterOptions<TFieldValues>;
  }
) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { title, options, ...otherProps } = props;
  const name = otherProps.name;

  const error = errors[name];
  const errorMsg =
    error?.message ||
    (error?.type === "required" ? "This field is required" : undefined);

  const invalid = error != null;
  const { className: parentClassName, ...other } = props;
  const classNames = [
    other.type === "checkbox" ? "form-check-input" : "form-control",
    invalid ? "is-invalid" : "",
    parentClassName,
  ];

  const className = classNames.join(" ");
  return (
    <>
      <label className="w-100 mb-2">
        {title}
        <input
          className={className}
          {...otherProps}
          {...register(name, options)}
        />
        <div className="invalid-feedback">{errorMsg}</div>
      </label>
    </>
  );
}
