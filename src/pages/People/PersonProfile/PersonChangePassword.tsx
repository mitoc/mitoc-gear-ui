import { useState } from "react";
import { useForm } from "react-hook-form";

import { authClient } from "src/apiClient/auth";
import { APIError } from "src/apiClient/client";
import { Form } from "src/components/Inputs/Form";
import { LabeledInput } from "src/components/Inputs/LabeledInput";
import { useSetPageTitle } from "src/hooks";
import { logIn } from "src/redux/auth";
import { useCurrentUser } from "src/redux/auth/hooks";
import { useAppDispatch } from "src/redux/hooks";

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
          }),
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
