import { isEmpty, map } from "lodash";
import { useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";

import { editPerson, Person } from "src/apiClient/people";
import { Form } from "src/components/Inputs/Form";
import { LabeledInput } from "src/components/Inputs/LabeledInput";
import { validateEmail } from "src/lib/validation";
import { useCurrentUser } from "src/redux/auth";

type Props = {
  person: Person;
  closeForm: () => void;
  refreshPerson: () => void;
};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  altEmails: { value: string }[];
};

export function PersonEditForm({ person, closeForm, refreshPerson }: Props) {
  const { user } = useCurrentUser();
  const formObject = useForm<FormValues>({
    defaultValues: {
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      altEmails: person.alternateEmails.map((value) => ({
        value,
      })),
    },
  });
  const { fields, append } = useFieldArray({
    control: formObject.control,
    name: "altEmails",
  });

  const onSubmit = (values: FormValues) => {
    const { firstName, lastName, email, altEmails: rawAltEmails } = values;
    const altEmails = map(rawAltEmails, "value").filter((v) => !isEmpty(v));
    editPerson(person.id, firstName, lastName, email, altEmails).then(() => {
      closeForm();
      refreshPerson();
    });
  };
  const isPersonUser = person.groups.some(
    ({ groupName }) => groupName === "Desk Worker",
  );
  const disableEmailEdit = isPersonUser && person.id !== user?.id;
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
        disabled={disableEmailEdit}
        options={{
          required: true,
          validate: (value) => {
            return validateEmail(value) || "Invalid email address";
          },
        }}
      />
      {fields.map((field, index) => (
        <LabeledInput
          key={field.id}
          title="Alternate email:"
          type="email"
          name={`altEmails.${index}.value` as const}
          options={{
            required: false,
            validate: (value) => {
              return (
                isEmpty(value) ||
                validateEmail(value) ||
                "Invalid email address"
              );
            },
          }}
        />
      ))}
      <DiscreetButton
        type="button"
        className="mb-2"
        onClick={() => {
          append({ value: "" });
        }}
      >
        Add Alternate email
      </DiscreetButton>
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

const DiscreetButton = styled.button`
  background: none;
  border: none;
  text-decoration: underline;
  color: #6c757d;
`;
