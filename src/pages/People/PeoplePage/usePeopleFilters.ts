import { isEmpty } from "lodash";

import { useQueryParamFilters } from "hooks/useQueryParamFilters";

import type { Filters } from "./PeopleFilters";

type Updater = (previousFilters: Filters) => Filters;
type ReturnType = {
  filters: Filters;
  setFilters: (updater: Updater) => void;
};

export function usePeopleFilters(): ReturnType {
  return useQueryParamFilters({ parse, serialize });
}

function serialize({
  openRentals,
  groups,
  q,
}: Filters): Record<string, string> {
  return {
    ...(q && { q }),
    ...(openRentals && { openRentals: "true" }),
    ...(!isEmpty(groups) && { groups: groups!.map(String).join(",") }),
  };
}

function parse(params: URLSearchParams): Filters {
  const openRentals = params.get("openRentals");
  const groups = params.get("groups");
  const q = params.get("q") ?? "";
  return {
    q,
    ...(openRentals === "true" && { openRentals: true }),
    ...(!isEmpty(groups) && { groups: groups!.split(",").map(Number) }),
  };
}
