import { useAppSelector } from "../../app/hooks";

import { LoginForm } from "./LoginForm";

export function AuthStatus() {
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
        {user.firstName} {user.lastName}
      </span>
    );
  }
}
