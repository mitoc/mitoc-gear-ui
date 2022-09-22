import { isEmpty } from "lodash";

import { useQueryParamFilters } from "hooks/useQueryParamFilters";

import type { Filters } from "./GearFilters";

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
}: Filters): Record<string, string> {
  return {
    ...(q && { q }),
    ...(broken != null && { broken: String(broken) }),
    ...(missing != null && { missing: String(missing) }),
    ...(retired !== undefined && { retired: String(retired) }),
    ...(!isEmpty(gearTypes) && { gearTypes: gearTypes!.map(String).join(",") }),
  };
}

function parse(params: URLSearchParams): Filters {
  const gearTypes = params.get("gearTypes");
  const missing = parseBooleanStrict(params.get("missing"));
  const retiredParam = parseBooleanStrict(params.get("retired"));
  // By default, don't show retired items
  const retired = retiredParam === undefined ? false : retiredParam;
  const broken = parseBooleanStrict(params.get("broken"));
  const q = params.get("q") ?? "";

  return {
    ...(!isEmpty(q) && { q }),
    ...(retired !== undefined && { retired }),
    ...(broken != null && { broken }),
    ...(missing != null && { missing }),
    ...(!isEmpty(gearTypes) && {
      gearTypes: gearTypes!.split(",").map(Number),
    }),
  };
}

function parseBooleanStrict(v: string | null) {
  switch (v) {
    case "true":
      return true;
    case "false":
      return false;
    case "null":
      return null;
    default:
      return undefined;
  }
}
