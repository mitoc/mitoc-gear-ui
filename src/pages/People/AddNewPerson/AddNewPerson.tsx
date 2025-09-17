import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { APIError as APIErrorClass } from "src/apiClient/client";
import { createPerson } from "src/apiClient/people";
import { APIErrorType } from "src/apiClient/types";
import { Form } from "src/components/Inputs/Form";
import { LabeledInput } from "src/components/Inputs/LabeledInput";
import { useSetPageTitle } from "src/hooks";
import { validateEmail } from "src/lib/validation";

import { AddNewPersonError } from "./AddNewPersonError";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export function AddNewPerson() {
  useSetPageTitle("Add New Person");
  const [error, setError] = useState<APIErrorType | undefined>();
  const navigate = useNavigate();

  const formObject = useForm<FormValues>();

  const onSubmit = (args: FormValues) => {
    createPerson(args)
      .then((person) => {
        setError(undefined);
        navigate(`/people/${person.id}`);
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
        <Form onSubmit={onSubmit} form={formObject}>
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
          <div className="d-flex justify-content-between mb-3">
            <Link to="/people">
              <button type="button" className="btn btn-outline-secondary">
                Cancel
              </button>
            </Link>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
