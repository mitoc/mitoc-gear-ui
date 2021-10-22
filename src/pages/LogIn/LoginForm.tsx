import { useState } from "react";

import { useAppDispatch } from "app/hooks";
import { logIn } from "features/auth/authSlice";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <div className="row">
      <div className="col-sm-6">
        <form>
          <label className="form-group w-100 mb-2">
            Email:
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(evt) => {
                setEmail(evt.target.value);
              }}
            />
          </label>
          <br />
          <label className="form-group w-100 mb-2">
            Password:
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(evt) => {
                setPassword(evt.target.value);
              }}
            />
          </label>
          <br />
          <button
            className="btn btn-primary"
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
      </div>
    </div>
  );
}
