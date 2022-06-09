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

function serialize({ openRentals, groups }: Filters): Record<string, string> {
  return {
    ...(openRentals && { openRentals: "true" }),
    ...(!isEmpty(groups) && { groups: groups!.map(String).join(",") }),
  };
}

function parse(params: URLSearchParams): Filters {
  const openRentals = params.get("openRentals");
  const groups = params.get("groups");
  return {
    ...(openRentals === "true" && { openRentals: true }),
    ...(!isEmpty(groups) && { groups: groups!.split(",").map(Number) }),
  };
}
