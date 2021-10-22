import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { logOut } from "./authSlice";
import { LoginForm } from "./LoginForm";

export function AuthStatus() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    (state) => state.auth.loadingStatus === "loading"
  );
  const user = useAppSelector((state) => state.auth.user);
  if (isLoading) {
    return <span>It's loading!</span>;
  } else if (user == null) {
    return <LoginForm />;
  } else {
    return (
      <span>
        Logged in as {user.firstName} {user.lastName}
        <br />
        <button onClick={() => dispatch(logOut())}>Log out</button>
      </span>
    );
  }
}
