import { useRef } from "react";
import { Link, LinkProps } from "react-router-dom";
import type { AsyncThunkAction } from "@reduxjs/toolkit";

import { useAppDispatch } from "app/hooks";
import { useEffect } from "react";
import { useCallback } from "react";

type Props = {
  id: string;
  fetchAction: (arg: string) => AsyncThunkAction<any, string, {}>;
} & LinkProps;

const delay = 150;

export function PrefetchLink({
  id,
  children,
  fetchAction,
  ...otherProps
}: Props) {
  const dispatch = useAppDispatch();
  const preload = useCallback(() => dispatch(fetchAction(id)), [id]);
  const handler = useRef<NodeJS.Timeout | null>(null);
  const clearHandler = useCallback(() => {
    if (handler.current == null) {
      return;
    }
    clearTimeout(handler.current);
  }, [handler]);

  const onMouseEnter = useCallback(() => {
    handler.current = setTimeout(preload, delay);
  }, [preload]);

  useEffect(() => {
    return clearHandler;
  });

  return (
    <Link
      {...otherProps}
      onMouseEnter={onMouseEnter}
      onMouseLeave={clearHandler}
    >
      {children}
    </Link>
  );
}
