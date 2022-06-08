import Select from "react-select";

import { GearType } from "apiClient/gear";
import { useGetGearTypesQuery } from "redux/api";
import { GearTypeSelect } from "components/GearTypeSelect";

export type Filters = {
  gearTypes?: GearType[];
};

type Props = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

export function GearFilters({ filters, setFilters }: Props) {
  const { data: gearTypes } = useGetGearTypesQuery();

  const update = (updater: Partial<Filters>) =>
    setFilters({ ...filters, ...updater });

  return (
    <div className="form mb-3 col-lg-6">
      <label>Gear Types:</label>
      <GearTypeSelect
        gearTypes={filters.gearTypes ?? []}
        onChange={(gearTypes) => update({ gearTypes })}
      />
    </div>
  );
}
