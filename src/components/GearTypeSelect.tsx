import { useCallback } from "react";
import Select, { MultiValue } from "react-select";

import { useGetGearTypesQuery } from "redux/api";
import { GearType } from "apiClient/gear";

type GearTypeOption = GearType & {
  value: number;
  label: string;
};

type Props = {
  gearTypes: number[];
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
    <Select
      className="flex-grow-1"
      isMulti={true}
      options={gearTypeOptions}
      value={values}
      onChange={onChange}
    />
  );
}

function parseOption(o: GearTypeOption): GearType {
  const { value, label, ...other } = o;
  return other;
}
