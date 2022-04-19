import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import { authClient } from "apiClient/auth";
import { Form } from "components/Inputs/Form";
import { LabeledInput } from "components/Inputs/LabeledInput";

type FormValues = {
  password: string;
};

export function RequestPasswordConfirm() {
  const [tokenVerified, setTokenVerified] = useState<boolean | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const email = params.get("email");
  const token = params.get("token");

  useEffect(() => {
    if (email == null || token == null) {
      return setTokenVerified(false);
    }
    authClient
      .checkResetPasswordToken({ email, token })
      .then(() => setTokenVerified(true))
      .catch(() => setTokenVerified(false));
  }, [email, token]);

  const form = useForm<FormValues>();

  const onSubmit = ({ password }: FormValues) => {
    if (email == null || token == null) {
      return;
    }
    authClient
      .confirmResetPassword({
        email,
        password,
        token,
      })
      .then(() => setSuccess(true));
  };

  return (
    <div className="row">
      <div className="col-sm-6">
        <h1>Reset password</h1>
        {tokenVerified === false && (
          <div className="alert alert-danger">
            Invalid token. The link you're using might have expired. Please
            request a new one <Link to="./request">here</Link>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            Your password has been updated! Click <Link to="/login">here</Link>{" "}
            to login!
          </div>
        )}
        <Form form={form} onSubmit={onSubmit}>
          <input
            hidden
            type="text"
            readOnly
            value={email ?? ""}
            autoComplete="username"
          />
          <LabeledInput
            title="New password:"
            name="password"
            type="password"
            autoComplete="new-password"
            options={{
              required: true,
              minLength: {
                value: 6,
                message: "Your password needs to have at least 6 characters",
              },
            }}
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={tokenVerified === false || email == null || token == null}
          >
            Reset password
          </button>
        </Form>
      </div>
    </div>
  );
}
