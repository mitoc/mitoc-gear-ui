import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";

import {
  fetchPurchasableItems,
  fetchAffiliations,
  fetchPerson,
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
