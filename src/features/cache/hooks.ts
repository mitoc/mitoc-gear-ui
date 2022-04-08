import { useCallback, useEffect, useState } from "react";
import type { AsyncThunk } from "@reduxjs/toolkit";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { ListWrapper } from "apiClient/types";

import {
  fetchPurchasableItems,
  fetchAffiliations,
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

function useItemList<T, Arg extends { page?: number }>(
  get: (state: CacheState) => PaginatedQueryState<T>,
  fetchFn: AsyncThunk<ListWrapper<T>, Arg, {}>,
  arg: Arg
) {
  const dispatch = useAppDispatch();
  const { page, ...otherArgs } = arg;
  const query = JSON.stringify(otherArgs);
  const p = page ?? 1;
  const items = useAppSelector(
    (state) => get(state.cache)[query]?.results?.[p]?.value
  );

  const count = useAppSelector((state) => get(state.cache)[query]?.number);
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

/* Similiar to useItemList, but keep returing old result while waiting for the
 * query to complete. This makes the UI more stable.
 */
function useSmoothItemList<T, Arg extends { page?: number }>(
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

export function useGearList(
  q?: string,
  page?: number,
  includeRetired: boolean = false
) {
  const { items: gearList, nbPages } = useSmoothItemList(
    (cache) => cache.gearSets,
    fetchGearList,
    { q: q?.trim() ?? "", page, includeRetired }
  );
  return { gearList, nbPages };
}
