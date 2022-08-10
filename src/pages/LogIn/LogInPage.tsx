import { Redirect } from "react-router-dom";

import { useCurrentUser } from "redux/auth";

import { LoginForm } from "./LoginForm";

export default function Login() {
  const { search } = window.location;
  const redirectTo = new URLSearchParams(search).get("redirectTo");
  const { isLoading, loggedIn, error } = useCurrentUser();
  if (!isLoading && loggedIn) {
    return <Redirect to={redirectTo || "/"} />;
  }
  return (
    <>
      <h1>Log in</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error.msg}
        </div>
      )}
      <LoginForm />
    </>
  );
}
