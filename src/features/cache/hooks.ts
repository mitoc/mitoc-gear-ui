import { useCallback, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";

import {
  fetchPurchasableItems,
  fetchAffiliations,
  fetchPerson,
  fetchPersonList,
  fetchGearList,
} from "./cacheSlice";
import { SetsKey, ValueList } from "./types";

export function usePurchasableItems() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cache.purchasableItems.value);
  useEffect(() => {
    if (items != null) {
      return;
    }
    dispatch(fetchPurchasableItems());
  }, [dispatch]);
  return items ?? [];
}

export function useAffiliations() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cache.affiliations.value);
  useEffect(() => {
    if (items != null) {
      return;
    }
    dispatch(fetchAffiliations());
  }, [dispatch]);
  return items ?? [];
}

export function usePerson(id: string) {
  const dispatch = useAppDispatch();
  const person = useAppSelector((state) => state.cache.people[id]?.value);
  useEffect(() => {
    if (person != null) {
      return;
    }
    dispatch(fetchPerson(id));
  }, [dispatch]);
  return person;
}

function useItemList<K extends SetsKey>(pty: K, query: string, page?: number) {
  const dispatch = useAppDispatch();
  const q = query.trim();
  const p = page ?? 1;
  const items = useAppSelector(
    (state) => state.cache[pty][q]?.results?.[p]?.value
  ) as ValueList<K>;
  const count = useAppSelector((state) => state.cache[pty][q]?.number);
  const nbPages = count != null ? Math.ceil(count / 50) : count;

  const fetchFn = pty === "peopleSets" ? fetchPersonList : fetchGearList;

  const fetch = useCallback(
    // @ts-expect-error
    (q: string, page?: number) => dispatch(fetchFn({ q, page })),
    [dispatch]
  );

  useEffect(() => {
    if (items != null) {
      return;
    }
    fetch(q, p);
  }, [fetch, q, p]);

  return { items, nbPages };
}

/* Similiar to useItemList, but keep returing old result while waiting for the
 * query to complete. This makes the UI more stable.
 */
function useSmoothItemList<K extends SetsKey>(
  pty: K,
  query: string,
  page?: number
) {
  const { items, nbPages } = useItemList(pty, query, page);
  const [smoothItems, setItems] = useState<ValueList<K> | undefined>(undefined);
  const [smoothNbPages, setNbPages] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (items != null) {
      setItems(items);
    }
  }, [items]);
  useEffect(() => {
    if (nbPages != null) {
      setNbPages(nbPages);
    }
  }, [nbPages]);

  return { items: smoothItems, nbPages: smoothNbPages };
}

export function usePersonList(query: string, page?: number) {
  const { items: personList, nbPages } = useSmoothItemList(
    "peopleSets",
    query,
    page
  );
  return { personList, nbPages };
}

export function useGearList(query: string, page?: number) {
  const { items: gearList, nbPages } = useSmoothItemList(
    "gearSets",
    query,
    page
  );
  return { gearList, nbPages };
}
