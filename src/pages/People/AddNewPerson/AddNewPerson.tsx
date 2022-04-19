import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { APIError as APIErrorClass } from "apiClient/client";
import { APIErrorType } from "apiClient/types";
import { validateEmail } from "lib/validation";

import { AddNewPersonError } from "./AddNewPersonError";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { createPerson, CreatePersonArgs } from "apiClient/people";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export function AddNewPerson() {
  const [error, setError] = useState<APIErrorType | undefined>();
  const history = useHistory();

  const formObject = useForm<FormValues>();

  const { handleSubmit } = formObject;

  const onSubmit = (args: CreatePersonArgs) => {
    createPerson(args)
      .then((person) => {
        setError(undefined);
        history.push(`/people/${person.id}`);
      })
      .catch((err) => {
        if (err instanceof APIErrorClass) {
          setError(err.error);
        }
        throw err;
      });
  };
  return (
    <div className="row">
      <div className="col-lg-8">
        <h1>Add new person</h1>
        {error && <AddNewPersonError err={error} />}
        <FormProvider {...formObject}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <LabeledInput
              title="First Name:"
              type="text"
              name="firstName"
              options={{ required: true }}
            />
            <LabeledInput
              title="Last Name:"
              type="text"
              name="lastName"
              options={{ required: true }}
            />
            <LabeledInput
              title="Primary email:"
              type="email"
              name="email"
              options={{
                required: true,
                validate: (value) => {
                  return validateEmail(value) || "Invalid email address";
                },
              }}
            />
            <div className="d-flex justify-content-end w-100">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}