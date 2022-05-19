import { useForm } from "react-hook-form";
import { useState } from "react";

import { authClient } from "apiClient/auth";
import { APIError } from "apiClient/client";
import { useAppDispatch } from "redux/hooks";
import { Form } from "components/Inputs/Form";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { logIn } from "redux/auth";
import { useCurrentUser } from "redux/auth/hooks";
import { useSetPageTitle } from "hooks";

type FormValues = {
  oldPassword: string;
  newPassword: string;
};

export function ChangePassword() {
  useSetPageTitle("Change password");
  const dispatch = useAppDispatch();
  const { user } = useCurrentUser();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const form = useForm<FormValues>();

  const onSubmit = ({ oldPassword, newPassword }: FormValues) => {
    authClient
      .changePassword({
        oldPassword,
        newPassword,
      })
      .then(() => {
        setSuccess(true);
        setError("");
        dispatch(
          logIn({
            username: user!.email,
            password: newPassword,
          })
        );
      })
      .catch((err) => {
        setSuccess(false);
        if (err instanceof APIError) {
          setError(err.error.msg);
          return;
        }
        throw err;
      });
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h1>Change password</h1>
        {!success && error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Your password has been updated!
          </div>
        )}
        <Form form={form} onSubmit={onSubmit}>
          <input
            hidden
            type="text"
            readOnly
            value={user!.email ?? ""}
            autoComplete="username"
          />
          <LabeledInput
            title="Current password:"
            name="oldPassword"
            type="password"
            autoComplete="current-password"
            options={{
              required: true,
            }}
          />
          <LabeledInput
            title="New password:"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            options={{
              required: true,
              minLength: {
                value: 8,
                message: "Your password needs to have at least 8 characters",
              },
            }}
          />
          <button className="btn btn-primary" type="submit">
            Change password
          </button>
        </Form>
      </div>
    </div>
  );
}
