import { isEmpty } from "lodash";

import { useQueryParamFilters } from "src/hooks/useQueryParamFilters";

import { Filters, GearStatusFilter } from "./GearFilters";

type Updater = (previousFilters: Filters) => Filters;
type ReturnType = {
  filters: Filters;
  setFilters: (updater: Updater) => void;
};

export function useGearFilters(): ReturnType {
  return useQueryParamFilters({ parse, serialize });
}

function serialize({
  q,
  gearTypes,
  broken,
  missing,
  retired,
  locations,
}: Filters): Record<string, string> {
  return {
    ...(q && { q }),
    ...(broken != null && { broken: String(broken) }),
    ...(missing != null && { missing: String(missing) }),
    ...(retired != null &&
      retired !== GearStatusFilter.exclude && { retired: String(retired) }),
    ...(!isEmpty(gearTypes) && { gearTypes: gearTypes!.map(String).join(",") }),
    ...(!isEmpty(locations) && { locations: locations!.map(String).join(",") }),
  };
}

function parse(params: URLSearchParams): Filters {
  const gearTypes = params.get("gearTypes");
  const missing = parseStatus(params.get("missing"));
  // By default, don't show retired items
  const retired =
    parseStatus(params.get("retired")) ?? GearStatusFilter.exclude;
  const broken = parseStatus(params.get("broken"));
  const q = params.get("q") ?? "";
  const locations = params.get("locations") ?? "";

  return {
    ...(!isEmpty(q) && { q }),
    ...(retired !== null && { retired }),
    ...(broken != null && { broken }),
    ...(missing != null && { missing }),
    ...(!isEmpty(gearTypes) && {
      gearTypes: gearTypes!.split(",").map(Number),
    }),
    ...(!isEmpty(locations) && {
      locations: locations!.split(",").map(Number),
    }),
  };
}

function parseStatus(v: string | null) {
  if (v == null) {
    return null;
  }

  return GearStatusFilter[v as GearStatusFilter] ?? null;
}

export function gearStatusToBoolean(
  status?: GearStatusFilter,
): boolean | undefined {
  switch (status) {
    case GearStatusFilter.exclude:
      return false;
    case GearStatusFilter.onlyInclude:
      return true;
    case GearStatusFilter.include:
    default:
      return undefined;
  }
}
