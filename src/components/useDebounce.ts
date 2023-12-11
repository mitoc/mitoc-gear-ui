import { useMemo, useState } from "react";
import { debounce } from "lodash";

export function useDebounce<T extends (...args: any) => any>(
  fn: T,
  duration: number,
) {
  const [pending, setPending] = useState<boolean>(false);
  const debounced = useMemo(
    () =>
      debounce((...args: Parameters<typeof fn>) => {
        setPending(false);
        const result = fn(...args);
        return result;
      }, duration),
    [setPending, fn, duration],
  );
  return {
    pending,
    fn: (...args: Parameters<typeof fn>) => {
      setPending(true);
      return debounced(...args);
    },
  };
}
