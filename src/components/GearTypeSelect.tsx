import { useCallback } from "react";
import ReactSelect, { MultiValue } from "react-select";

import { useGetGearTypesQuery } from "redux/api";
import { GearType as APIGearType } from "apiClient/gear";

import { Select } from "./Select";

type GearType = Pick<APIGearType, "id" | "typeName" | "shorthand">;

type GearTypeOption = GearType & {
  value: number;
  label: string;
};

export function GearTypeSelect({
  value,
  onChange,
  invalid,
}: {
  value: GearType | null | undefined;
  onChange: (value: GearType | null) => void;
  invalid?: boolean;
}) {
  const gearTypeOptions = useGearTypesOptions();
  return (
    <Select
      className="flex-grow-1"
      options={gearTypeOptions}
      value={value}
      onChange={onChange}
      invalid={invalid}
    />
  );
}

type Props = {
  gearTypes: number[];
  onChange: (groups: GearType[]) => void;
};

export function GearTypeMultiSelect({
  gearTypes,
  onChange: onChangeProps,
}: Props) {
  const gearTypeOptions = useGearTypesOptions();
  const values =
    gearTypeOptions == null
      ? null
      : (gearTypes
          .map((id) => gearTypeOptions.find((opt) => opt.id === id))
          .filter((opt) => opt != null) as GearTypeOption[]);
  const onChange = useCallback(
    (options: MultiValue<GearTypeOption>) =>
      onChangeProps(options.map(parseOption)),
    [onChangeProps]
  );

  return (
    <ReactSelect
      className="flex-grow-1"
      isMulti={true}
      options={gearTypeOptions}
      value={values}
      onChange={onChange}
    />
  );
}

function useGearTypesOptions() {
  const { data: allGearTypes } = useGetGearTypesQuery();
  return (
    allGearTypes?.map((gearType) => ({
      value: gearType.id,
      label: gearType.typeName,
      ...gearType,
    })) ?? []
  );
}

function parseOption(o: GearTypeOption): GearType {
  const { value, label, ...other } = o;
  return other;
}
