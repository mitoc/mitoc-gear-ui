import BaseLayout from "components/BaseLayout";

import { LoginForm } from "./LoginForm";

export default function Login() {
  return (
    <BaseLayout>
      <div className="container main-content">
        <h1>Log in</h1>
        <LoginForm />
      </div>
    </BaseLayout>
  );
}
