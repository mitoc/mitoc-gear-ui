import { LinkProps } from "react-router-dom";

import { gearDbApi } from "redux/api";

import { PrefetchLink } from "./PrefetchLink";

type Props = { id: string } & Omit<LinkProps, "to">;

export function PersonLink({ id, ...otherProps }: Props) {
  const fetchPerson = gearDbApi.usePrefetch("getPerson");
  return (
    <PrefetchLink
      {...otherProps}
      id={id}
      // TODO: id should be a string
      fetchAction={() => fetchPerson(String(id))}
      to={`/people/${id}/`}
    />
  );
}
