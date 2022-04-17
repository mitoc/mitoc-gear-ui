import { useEffect, useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";

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

  const { register, handleSubmit: handleSubmit2, watch, setValue } = useForm({
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
      <label className="w-100 mb-2">
        Quantity to add:
        <input
          type="number"
          className="form-control"
          {...register("quantity", { required: true, valueAsNumber: true })}
        />
      </label>
      <label className="mb-2 form-switch">
        <input
          type="checkbox"
          className="form-check-input"
          {...register("autoGenerateIds")}
        />{" "}
        Automatically generate new ids
      </label>
      {!autoGenerateIds && (
        <label className="mb-2 w-100">
          First ID:
          <input
            type="text"
            className="form-control"
            {...register("idSuffix")}
          />
        </label>
      )}
      <label className="mb-2 w-100">
        Deposit amount:
        <input
          type="number"
          step={0.5}
          className="form-control"
          {...register("depositAmount", {
            required: true,
            valueAsNumber: true,
          })}
        />
      </label>
      <label className="mb-2 w-100">
        Specification:
        <input
          type="text"
          className="form-control"
          {...register("specification")}
        />
      </label>
      <label className="mb-2 w-100">
        Size:
        <input type="text" className="form-control" {...register("size")} />
      </label>
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
  );
}
