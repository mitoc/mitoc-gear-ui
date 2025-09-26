import { useCallback, useEffect, useRef } from "react";
import { Link, LinkProps } from "react-router-dom";

type Props = {
  id: string;
  fetchAction: () => void;
} & LinkProps;

const delay = 150;

export function PrefetchLink({
  id,
  children,
  fetchAction,
  ...otherProps
}: Props) {
  const handler = useRef<NodeJS.Timeout | null>(null);
  const clearHandler = useCallback(() => {
    if (handler.current == null) {
      return;
    }
    clearTimeout(handler.current);
  }, [handler]);

  const onMouseEnter = useCallback(() => {
    handler.current = setTimeout(fetchAction, delay);
  }, [fetchAction]);

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
