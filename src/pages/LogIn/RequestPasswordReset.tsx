import { useState } from "react";
import { useLocation } from "react-router-dom";

import { authClient } from "src/apiClient/auth";
import { useSetPageTitle } from "src/hooks";
import { validateEmail } from "src/lib/validation";

export default function RequestPasswordReset() {
  useSetPageTitle("Reset password");
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const emailParam = params.get("email");
  const [email, setEmail] = useState<string>(emailParam ?? "");
  const [success, setSuccess] = useState<boolean>(false);
  const [wasValidated, setWasValidated] = useState<boolean>();

  const emailError =
    wasValidated && !validateEmail(email) && "Invalid email address.";

  const onSubmit = () => {
    setWasValidated(true);
    if (!validateEmail(email)) {
      return;
    }
    authClient.requestResetPassword({ email }).then(() => setSuccess(true));
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h1>Reset password</h1>
        {success && (
          <div className="alert alert-success">
            Your request has been processed. If your email matches someone in
            our database, you will receive an email with a link to reset your
            password.
          </div>
        )}

        <p>
          Please enter the email associated with your account so that we can
          help you reset your password
        </p>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            onSubmit();
          }}
        >
          <label className="w-100 mb-2">
            Email:
            <input
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              required
              type="email"
              value={email}
              onChange={(evt) => {
                setEmail(evt.target.value);
              }}
            />
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </label>
          <br />
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
