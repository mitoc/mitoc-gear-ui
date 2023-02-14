import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router-dom";

import { LabeledInput } from "components/Inputs/LabeledInput";
import { Form } from "components/Inputs/Form";
import { PersonSelect } from "components/PersonSelect";

import { ApprovalItemsPicker, defaultItem } from "./ApprovalItemsPicker";
import { FormValues } from "./types";
import { ApprovalItemType, CreateNewApprovalArgs } from "apiClient/approvals";

type Props = {
  onSubmit: (args: CreateNewApprovalArgs) => void;
};

export function AddNewApprovalForm({ onSubmit }: Props) {
  const history = useHistory();
  const formObject = useForm<FormValues>({
    defaultValues: {
      items: [defaultItem],
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (!ensureApprovalComplete(values)) {
      // This case should not happen, the validation should handle it
      return;
    }
    onSubmit(values);
  };
  const startDate = formObject.watch("startDate");
  return (
    <Form onSubmit={handleSubmit} form={formObject}>
      <LabeledInput
        title="Renter:"
        name="renter"
        renderComponent={({ value, onChange, onBlur, invalid }) => {
          return (
            <PersonSelect
              value={value}
              onChange={(person) => onChange(person?.id)}
              invalid={invalid}
            />
          );
        }}
        options={{
          required: true,
        }}
      />
      <LabeledInput
        title="Start Date:"
        name="startDate"
        renderComponent={({ value, onChange, onBlur, invalid }) => {
          return (
            <DatePicker
              selected={value}
              onChange={onChange}
              className={`form-control ${invalid ? "is-invalid" : ""}`}
              wrapperClassName={invalid ? "is-invalid" : ""}
              onBlur={onBlur}
            />
          );
        }}
        options={{
          required: true,
        }}
      />
      <LabeledInput
        title="End Date:"
        name="endDate"
        renderComponent={({ value, onChange, onBlur, invalid }) => {
          return (
            <DatePicker
              selected={value}
              onChange={onChange}
              className={`form-control ${invalid ? "is-invalid" : ""}`}
              wrapperClassName={invalid ? "is-invalid" : ""}
              onBlur={onBlur}
            />
          );
        }}
        options={{
          required: true,
          validate: (value) => {
            if (startDate != null && value < startDate) {
              return "The approval end date cannot be before the start date.";
            }
          },
        }}
      />
      <ApprovalItemsPicker />

      <LabeledInput title="Note:" as="textarea" name="note" />

      <div className="d-flex justify-content-between mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={history.goBack}
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

function ensureApprovalComplete(
  approval: FormValues
): approval is CreateNewApprovalArgs {
  return approval.items.every((item) => {
    if (item.type === ApprovalItemType.gearType) {
      return item.item.gearType != null;
    }
    return item.item.gearItem != null;
  });
}
