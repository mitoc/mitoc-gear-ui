import { useCallback, useEffect, useState } from "react";
import type { AsyncThunk } from "@reduxjs/toolkit";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { ListWrapper } from "apiClient/types";

import {
  fetchPurchasableItems,
  fetchAffiliations,
  fetchPerson,
  fetchPersonList,
  fetchGearList,
} from "./cacheSlice";

import { PaginatedQueryState, CacheState } from "./types";

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

function useItemList<T, Arg extends { q?: string; page?: number }>(
  get: (state: CacheState) => PaginatedQueryState<T>,
  fetchFn: AsyncThunk<ListWrapper<T>, Arg, {}>,
  arg: Arg
) {
  const dispatch = useAppDispatch();
  const q = (arg.q ?? "").trim();
  const p = arg.page ?? 1;
  const items = useAppSelector(
    (state) => get(state.cache)[q]?.results?.[p]?.value
  );

  const count = useAppSelector((state) => get(state.cache)[q]?.number);
  const nbPages = count != null ? Math.ceil(count / 50) : count;

  const fetch = useCallback((arg: Arg) => dispatch(fetchFn(arg)), [dispatch]);

  useEffect(() => {
    if (items != null) {
      return;
    }
    fetch(arg);
  }, [fetch, JSON.stringify(arg)]);

  return { items, nbPages };
}

const foo = <T>(x: T) => x;

/* Similiar to useItemList, but keep returing old result while waiting for the
 * query to complete. This makes the UI more stable.
 */
function useSmoothItemList<T, Arg extends { q?: string; page?: number }>(
  get: (state: CacheState) => PaginatedQueryState<T>,
  fetchFn: AsyncThunk<ListWrapper<T>, Arg, {}>,
  arg: Arg
) {
  const { items, nbPages } = useItemList(get, fetchFn, arg);
  const [smoothItems, setItems] = useState<T[] | undefined>(undefined);
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

export function usePersonList(q?: string, page?: number) {
  const { items: personList, nbPages } = useSmoothItemList(
    (cache) => cache.peopleSets,
    fetchPersonList,
    { q, page }
  );
  return { personList, nbPages };
}

export function useGearList(
  q?: string,
  page?: number,
  includeRetired: boolean = false
) {
  const { items: gearList, nbPages } = useSmoothItemList(
    (cache) => cache.gearSets,
    fetchGearList,
    { q, page, includeRetired }
  );
  return { gearList, nbPages };
}
