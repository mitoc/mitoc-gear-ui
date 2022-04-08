import { LinkProps } from "react-router-dom";

import { fetchGear } from "features/cache";

import { PrefetchLink } from "./PrefetchLink";

type Props = { id: string } & Omit<LinkProps, "to">;

export function GearLink({ id, ...otherProps }: Props) {
  return (
    <PrefetchLink
      {...otherProps}
      id={id}
      // @ts-expect-error
      fetchAction={fetchGear}
      to={`/gear/${id}/`}
    />
  );
}
