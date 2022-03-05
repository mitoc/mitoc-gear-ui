import { debounce } from "lodash";
import { useMemo, useEffect, useState } from "react";

import { GearSummary, getGearList } from "apiClient/gear";

type Args = {
  query: string;
  page?: number;
};

export function useGearList({ query, page }: Args) {
  const [gearList, setGearList] = useState<GearSummary[] | null>(null);
  const [nbPage, setNbPage] = useState<number>(1);
  const fetch = useMemo(
    () =>
      debounce(
        (q: string, page?: number) =>
          getGearList(q, page).then((data) => {
            setGearList(data.results);
            setNbPage(Math.ceil(data.count / 50));
          }),
        300
      ),
    [setGearList]
  );

  useEffect(() => {
    fetch(query.trim(), page);
  }, [query, page, fetch]);

  return { nbPage, gearList };
}
