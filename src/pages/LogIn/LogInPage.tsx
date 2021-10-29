import { Redirect } from "react-router-dom";

import { useCurrentUser } from "features/auth";

import { LoginForm } from "./LoginForm";

export default function Login() {
  const { isLoading, loggedIn } = useCurrentUser();
  if (!isLoading && loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <h1>Log in</h1>
      <LoginForm />
    </>
  );
}
