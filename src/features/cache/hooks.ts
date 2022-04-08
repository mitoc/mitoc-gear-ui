import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";

import { fetchPurchasableItems, fetchAffiliations } from "./cacheSlice";

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
