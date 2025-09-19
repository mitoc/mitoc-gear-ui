import { map } from "lodash";

import { GearLocationSelect } from "src/components/GearLocationSelect";
import { GearTypeMultiSelect } from "src/components/GearTypeSelect";
import { Select } from "src/components/Inputs/Select";

export enum GearStatusFilter {
  include = "include",
  onlyInclude = "onlyInclude",
  exclude = "exclude",
}

export type Filters = {
  q?: string;
  gearTypes?: number[];
  restricted?: GearStatusFilter;
  broken?: GearStatusFilter;
  retired?: GearStatusFilter;
  missing?: GearStatusFilter;
  locations?: number[];
};

type Props = {
  filters: Filters;
  setFilters: (updater: (previousFilters: Filters) => Filters) => void;
};

export function GearFilters({ filters, setFilters }: Props) {
  const update = (updater: Partial<Filters>) =>
    setFilters((filters) => ({ ...filters, ...updater }));

  return (
    <div className="form mb-3 col-lg-6">
      <div className="mb-2">
        <label>Gear Types:</label>
        <GearTypeMultiSelect
          gearTypes={filters.gearTypes ?? []}
          onChange={(gearTypes) => update({ gearTypes: map(gearTypes, "id") })}
        />
      </div>

      <div className="mb-2">
        <label>Locations:</label>
        <GearLocationSelect
          locations={filters.locations ?? []}
          onChange={(locations) => update({ locations: map(locations, "id") })}
        />
      </div>

      {gearStatus.map((status) => (
        <div className="mb-1" key={status}>
          <Select
            options={gearStatusOptions}
            onChange={(option) => {
              update({
                [status]: option as GearStatusFilter,
              });
            }}
            value={filters[status]}
            style={{ display: "inline", width: "unset" }}
          />{" "}
          {status} gear
        </div>
      ))}
    </div>
  );
}

const gearStatus = ["restricted", "broken", "missing", "retired"] as const;

const gearStatusOptions = [
  { value: GearStatusFilter.include, label: "Include" },
  { value: GearStatusFilter.onlyInclude, label: "Only include" },
  { value: GearStatusFilter.exclude, label: "Do not include" },
];
