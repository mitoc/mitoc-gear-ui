import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "redux/hooks";

import { checkLoggedIn } from "./authSlice";

// TODO: Ideally these should be ids rather than an arbitrary numbers
enum Roles {
  BOD = 1,
  GEAR_MANAGER = 6,
  DESK_CAPTAIN = 8,
  ADMIN = 24,
  APPROVER = 25,
}

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
    return { isDeskWorker: false, isOfficer: false, isDeskManager: false };
  }
  return {
    isOfficer: user.groups.some((g) => g.id === Roles.BOD),
    isDeskManager: user.groups.some((g) =>
      [Roles.DESK_CAPTAIN, Roles.GEAR_MANAGER, Roles.ADMIN].includes(g.id),
    ),
    isDeskWorker: user.isDeskworker,
    isApprover: user.groups.some((g) =>
      [Roles.ADMIN, Roles.APPROVER].includes(g.id),
    ),
  };
}
