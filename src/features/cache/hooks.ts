import { useCallback, useEffect, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";

import {
  fetchPurchasableItems,
  fetchAffiliations,
  fetchPerson,
  fetchPersonList,
} from "./cacheSlice";

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

export function usePersonList(query: string, page?: number) {
  const dispatch = useAppDispatch();
  const q = query.trim();
  const p = page ?? 1;
  const personList = useAppSelector(
    (state) => state.cache.peopleSets[q]?.results?.[p]?.value
  );
  const count = useAppSelector((state) => state.cache.peopleSets[q]?.number);
  const nbPages = count != null ? Math.ceil(count / 50) : count;

  const fetch = useCallback(
    (q: string, page?: number) => dispatch(fetchPersonList({ q, page })),
    [dispatch]
  );

  useEffect(() => {
    if (personList != null) {
      return;
    }
    fetch(q, p);
  }, [fetch, q, p]);

  return { personList, nbPages };
}
