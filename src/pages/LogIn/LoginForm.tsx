import { isEmpty } from "lodash";
import { useState } from "react";
import { Link } from "react-router-dom";

import { validateEmail } from "src/lib/validation";
import { logIn } from "src/redux/auth/authSlice";
import { useAppDispatch } from "src/redux/hooks";

import { SignInWithGoogle } from "./SignInWithGoogle";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [wasValidated, setWasValidated] = useState<boolean>();

  const emailError =
    wasValidated && !validateEmail(email) && "Invalid email address.";

  const passwordError =
    wasValidated && isEmpty(password) && "Password cannot be empty.";

  const onSubmit = () => {
    setWasValidated(true);
    if (!validateEmail(email) || isEmpty(password)) {
      return;
    }
    dispatch(
      logIn({
        username: email.trim(),
        password,
      }),
    );
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <SignInWithGoogle />
        <hr />
        <form>
          <label className="w-100 mb-2">
            Email:
            <input
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              required
              autoComplete="email"
              type="email"
              value={email}
              onChange={(evt) => {
                setEmail(evt.target.value);
              }}
            />
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </label>
          <br />
          <label className="w-100 mb-2">
            Password:
            <input
              type="password"
              required
              autoComplete="current-password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              value={password}
              onChange={(evt) => {
                setPassword(evt.target.value);
              }}
            />
            {passwordError && (
              <div className="invalid-feedback">{passwordError}</div>
            )}
          </label>
          <br />
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-primary"
              type="submit"
              onClick={(evt) => {
                evt.preventDefault();
                onSubmit();
              }}
            >
              Log in
            </button>
            <Link to="/reset-password/request/">Forgot your password?</Link>
          </div>
          <br />
        </form>
      </div>
    </div>
  );
}
