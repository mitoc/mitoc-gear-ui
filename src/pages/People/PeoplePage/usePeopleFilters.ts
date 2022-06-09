import { isEmpty } from "lodash";
import { useHistory, useLocation } from "react-router";

import type { Filters } from "./PeopleFilters";

type Updater = (previousFilters: Filters) => Filters;
type ReturnType = {
  filters: Filters;
  setFilters: (updater: Updater) => void;
};

export function usePeopleFilters(): ReturnType {
  const history = useHistory();
  const location = useLocation();

  const getFilters = () => {
    const params = new URLSearchParams(location.search);
    return parse(params);
  };

  const setFilters = (updater: Updater) => {
    const newFilters = updater(getFilters());
    const serialized = serialize(newFilters);
    const params = new URLSearchParams(serialized);
    history.replace({ pathname: location.pathname, search: params.toString() });
  };

  return { filters: getFilters(), setFilters };
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
