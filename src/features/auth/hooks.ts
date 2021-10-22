import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";

import { checkLoggedIn } from "./authSlice";

export function useLoadCurrentUser() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkLoggedIn());
  }, []);
  return useCurrentUser();
}

export function useCurrentUser() {
  return useAppSelector((state) => ({
    isLoading: state.auth.loadingStatus === "loading",
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
  }));
}
