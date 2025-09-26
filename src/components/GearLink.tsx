import { LinkProps } from "react-router-dom";

import { gearDbApi } from "src/redux/api";

import { PrefetchLink } from "./PrefetchLink";

type Props = { id: string } & Omit<LinkProps, "to">;

export function GearLink({ id, ...otherProps }: Props) {
  const prefetchGearItem = gearDbApi.usePrefetch("getGearItem");

  return (
    <PrefetchLink
      {...otherProps}
      id={id}
      fetchAction={() => prefetchGearItem(id)}
      to={`/gear/${id}/`}
    />
  );
}
