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
    ...(retired === true && { retired: "true" }),
    ...(!isEmpty(gearTypes) && { gearTypes: gearTypes!.map(String).join(",") }),
  };
}

function parse(params: URLSearchParams): Filters {
  const gearTypes = params.get("gearTypes");
  const missing = parseBooleanStrict(params.get("missing"));
  // By default, don't show retired items
  const retired = parseBooleanStrict(params.get("retired")) ?? false;
  const broken = parseBooleanStrict(params.get("broken"));
  const q = params.get("q") ?? "";

  return {
    ...(!isEmpty(q) && { q }),
    retired,
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
    default:
      return null;
  }
}
