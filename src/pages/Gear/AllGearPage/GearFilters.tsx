import { GearType } from "apiClient/gear";
import { useGetGearTypesQuery } from "redux/api";
import { GearTypeSelect } from "components/GearTypeSelect";
import { Select } from "components/Inputs/Select";
import { useState } from "react";

export type Filters = {
  gearTypes?: GearType[];
  broken?: boolean;
};

type Props = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

export function GearFilters({ filters, setFilters }: Props) {
  const update = (updater: Partial<Filters>) =>
    setFilters({ ...filters, ...updater });

  return (
    <div className="form mb-3 col-lg-6">
      <div className="mb-2">
        <label>Gear Types:</label>
        <GearTypeSelect
          gearTypes={filters.gearTypes ?? []}
          onChange={(gearTypes) => update({ gearTypes })}
        />
      </div>
      <Select
        options={gearStatusOptions}
        onChange={(option) => {
          update({
            broken: optionToGearStatusFilter(option as GearStatusFilter),
          });
        }}
        value={gearStatusFilterToOption(filters.broken)}
        style={{ display: "inline", width: "unset" }}
      />{" "}
      broken gear
    </div>
  );
}

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
