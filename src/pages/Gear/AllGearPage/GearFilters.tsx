import { GearType } from "apiClient/gear";
import { useGetGearTypesQuery } from "redux/api";
import { GearTypeSelect } from "components/GearTypeSelect";
import { Select } from "components/Inputs/Select";
import { useState } from "react";

export type Filters = {
  gearTypes?: GearType[];
  broken?: boolean;
  retired?: boolean;
  missing?: boolean;
};

type Props = {
  filters: Filters;
  setFilters: (
    filters: Filters | ((previousFilters: Filters) => Filters)
  ) => void;
};

export function GearFilters({ filters, setFilters }: Props) {
  const update = (updater: Partial<Filters>) =>
    setFilters((filters) => ({ ...filters, ...updater }));

  return (
    <div className="form mb-3 col-lg-6">
      <div className="mb-2">
        <label>Gear Types:</label>
        <GearTypeSelect
          gearTypes={filters.gearTypes ?? []}
          onChange={(gearTypes) => update({ gearTypes })}
        />
      </div>

      {gearStatus.map((status) => (
        <div className="mb-1">
          <Select
            options={gearStatusOptions}
            onChange={(option) => {
              update({
                [status]: optionToGearStatusFilter(option as GearStatusFilter),
              });
            }}
            value={gearStatusFilterToOption(filters[status])}
            style={{ display: "inline", width: "unset" }}
          />{" "}
          {status} gear
        </div>
      ))}
    </div>
  );
}

const gearStatus = ["broken", "missing", "retired"] as const;

enum GearStatusFilter {
  include = "include",
  onlyInclude = "onlyInclude",
  exclude = "exclude",
}

const gearStatusOptions = [
  { value: GearStatusFilter.include, label: "Include" },
  { value: GearStatusFilter.onlyInclude, label: "Only include" },
  { value: GearStatusFilter.exclude, label: "Do not include" },
];

function gearStatusFilterToOption(filter?: boolean) {
  switch (filter) {
    case undefined:
      return GearStatusFilter.include;
    case false:
      return GearStatusFilter.exclude;
    case true:
      return GearStatusFilter.onlyInclude;
  }
}

function optionToGearStatusFilter(filter: GearStatusFilter) {
  switch (filter) {
    case GearStatusFilter.include:
      return undefined;
    case GearStatusFilter.exclude:
      return false;
    case GearStatusFilter.onlyInclude:
      return true;
  }
}
