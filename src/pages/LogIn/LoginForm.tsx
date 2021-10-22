import { useState } from "react";

import { useAppDispatch } from "app/hooks";
import { logIn } from "features/auth/authSlice";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <form>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(evt) => {
            setEmail(evt.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        />
      </label>
      <br />
      <button
        type="submit"
        onClick={(evt) => {
          evt.preventDefault();
          dispatch(
            logIn({
              username: email,
              password,
            })
          );
        }}
      >
        Log in
      </button>
      <br />
    </form>
  );
}
