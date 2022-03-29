import { LinkProps } from "react-router-dom";

import { fetchPerson } from "features/cache";

import { PrefetchLink } from "./PrefetchLink";

type Props = { id: string } & Omit<LinkProps, "to">;

export function PersonLink({ id, ...otherProps }: Props) {
  return (
    <PrefetchLink
      {...otherProps}
      id={id}
      fetchAction={fetchPerson}
      to={`/people/${id}/`}
    />
  );
}
