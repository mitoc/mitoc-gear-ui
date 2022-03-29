import React, { useRef } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch } from "app/hooks";
import { fetchPerson } from "features/cache";
import { useEffect } from "react";
import { useCallback } from "react";

type Props = { children: React.ReactNode; id: string };

const delay = 150;

export function PersonLink({ id, children }: Props) {
  const dispatch = useAppDispatch();
  const preload = useCallback(() => dispatch(fetchPerson(id)), [id]);
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={clearHandler}
      to={`/people/${id}`}
    >
      {children}
    </Link>
  );
}
