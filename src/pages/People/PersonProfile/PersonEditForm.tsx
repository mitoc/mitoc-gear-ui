import { useState } from "react";
import { useForm } from "react-hook-form";

import { Form } from "components/Inputs/Form";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { editPerson, Person } from "apiClient/people";
import { validateEmail } from "lib/validation";

type Props = {
  person: Person;
  closeForm: () => void;
  refreshPerson: () => void;
};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export function PersonEditForm({ person, closeForm, refreshPerson }: Props) {
  const formObject = useForm<FormValues>({
    defaultValues: {
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
    },
  });

  const onSubmit = (values: FormValues) => {
    const { firstName, lastName, email } = values;
    editPerson(person.id, firstName, lastName, email).then(() => {
      closeForm();
      refreshPerson();
    });
  };
  return (
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
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={closeForm}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </Form>
  );
}
