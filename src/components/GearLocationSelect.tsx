import { useCallback } from "react";
import Select, { MultiValue } from "react-select";

import { useGetGearLocationsQuery } from "redux/api";
import { GearLocation } from "apiClient/gear";

type GearLocationOption = GearLocation & {
  value: number;
  label: string;
};

type Props = {
  locations: number[];
  onChange: (groups: GearLocation[]) => void;
};

export function GearLocationSelect({ locations, onChange: onChangeProps }: Props) {
  const { data: allGearLocations } = useGetGearLocationsQuery();
  const gearLocationOptions =
    allGearLocations?.map((allGearLocations) => ({
      value: allGearLocations.id,
      label: allGearLocations.shorthand,
      ...allGearLocations,
    })) ?? [];
  const values =
    gearLocationOptions == null
      ? null
      : (locations
          .map((id) => gearLocationOptions.find((opt) => opt.id === id))
          .filter((opt) => opt != null) as GearLocationOption[]);
  const onChange = useCallback(
    (options: MultiValue<GearLocationOption>) =>
      onChangeProps(options.map(parseOption)),
    [onChangeProps]
  );

  return (
    <Select
      className="flex-grow-1"
      isMulti={true}
      options={gearLocationOptions}
      value={values}
      onChange={onChange}
    />
  );
}

function parseOption(o: GearLocationOption): GearLocation {
  const { value, label, ...other } = o;
  return other;
}
