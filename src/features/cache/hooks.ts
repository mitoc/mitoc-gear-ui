import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";

import { fetchPurchasableItems } from "./cacheSlice";

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

export function useCurrentUser() {
  return useAppSelector((state) => ({
    isLoading:
      state.auth.loadingStatus === "loading" ||
      state.auth.loadingStatus === "blank",
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
  }));
}
