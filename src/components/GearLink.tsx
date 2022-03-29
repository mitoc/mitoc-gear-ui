import { LinkProps } from "react-router-dom";

import { fetchGear } from "features/cache";

import { PrefetchLink } from "./PrefetchLink";

type Props = { id: string } & Omit<LinkProps, "to">;

export function GearLink({ id, ...otherProps }: Props) {
  return (
    <PrefetchLink
      {...otherProps}
      id={id}
      fetchAction={fetchGear}
      to={`/gear/${id}/`}
    />
  );
}
