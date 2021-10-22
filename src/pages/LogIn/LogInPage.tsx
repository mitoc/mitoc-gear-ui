import { Redirect } from "react-router-dom";

import BaseLayout from "components/BaseLayout";
import { useCurrentUser } from "features/auth";

import { LoginForm } from "./LoginForm";

export default function Login() {
  const { isLoading, loggedIn } = useCurrentUser();
  if (!isLoading && loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <BaseLayout>
      <div className="container main-content">
        <h1>Log in</h1>
        <LoginForm />
      </div>
    </BaseLayout>
  );
}
