import { debounce, isEmpty } from "lodash";
import { useMemo, useEffect, useState } from "react";

import { GearSummary, getGearList } from "apiClient/gear";

type Args = {
  query: string;
  page?: number;
  runOnEmptyQuery?: boolean;
};

export function useGearList({ query, page, runOnEmptyQuery = true }: Args) {
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
    if (!isEmpty(query) || runOnEmptyQuery) {
      fetch(query.trim(), page);
    }
  }, [query, page, fetch]);

  return { nbPage, gearList };
}
