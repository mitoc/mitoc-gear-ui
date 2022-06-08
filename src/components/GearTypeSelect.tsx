import { useCallback } from "react";
import Select, { MultiValue } from "react-select";

import { useGetGearTypesQuery } from "redux/api";
import { GearType } from "apiClient/gear";

type GearTypeOption = GearType & {
  value: number;
  label: string;
};

type Props = {
  gearTypes: GearType[];
  onChange: (groups: GearType[]) => void;
};

export function GearTypeSelect({ gearTypes, onChange: onChangeProps }: Props) {
  const { data: allGearTypes } = useGetGearTypesQuery();
  const gearTypeOptions =
    allGearTypes?.map((gearType) => ({
      value: gearType.id,
      label: gearType.typeName,
      ...gearType,
    })) ?? [];
  const values = gearTypes.map(makeOption);
  const onChange = useCallback(
    (options: MultiValue<GearTypeOption>) =>
      onChangeProps(options.map(parseOption)),
    []
  );

  return (
    <Select
      className="flex-grow-1"
      isMulti={true}
      options={gearTypeOptions}
      value={values}
      onChange={onChange}
    />
  );
}

function makeOption(g: GearType): GearTypeOption {
  return {
    ...g,
    value: g.id,
    label: g.typeName,
  };
}

function parseOption(o: GearTypeOption): GearType {
  const { value, label, ...other } = o;
  return other;
}
