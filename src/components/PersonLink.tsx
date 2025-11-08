import { LinkProps } from "react-router-dom";

import { PersonID } from "src/apiClient/idTypes";
import { gearDbApi } from "src/redux/api";

import { PrefetchLink } from "./PrefetchLink";

type Props = { id: PersonID } & Omit<LinkProps, "to" | "id">;

export function PersonLink({ id, ...otherProps }: Props) {
  const fetchPerson = gearDbApi.usePrefetch("getPerson");
  return (
    <PrefetchLink
      {...otherProps}
      id={id}
      fetchAction={() => fetchPerson(id)}
      to={`/people/${id}/`}
    />
  );
}
