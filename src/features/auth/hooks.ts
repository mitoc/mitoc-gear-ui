import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";

import { checkLoggedIn } from "./authSlice";

// TODO: Ideally this should be an id rather than an arbitrary number
const BOD_GROUP_ID = 1;

export function useLoadCurrentUser() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkLoggedIn());
  }, [dispatch]);
  return useCurrentUser();
}

export function useCurrentUser() {
  return useAppSelector((state) => ({
    isLoading:
      state.auth.loadingStatus === "loading" ||
      state.auth.loadingStatus === "blank",
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
    error: state.auth.error,
  }));
}

export function usePermissions() {
  const user = useCurrentUser().user;
  if (user == null) {
    return { isDeskWorker: false, isOfficer: false };
  }
  return {
    isOfficer: user.groups.some((g) => g.id === BOD_GROUP_ID),
    isDeskWorker: user.isDeskworker,
  };
}
