import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router-dom";

import { LabeledInput } from "components/Inputs/LabeledInput";
import { Form } from "components/Inputs/Form";
import { PersonSelect } from "components/PersonSelect";

import { ApprovalItemsPicker, defaultItem } from "./ApprovalItemsPicker";
import { FormValues } from "./types";

// TODO: Validate dates are in the right order
// TODO: Handle submit
// TODO: Simplify with LabeledControlledInput?

export function AddNewApproval() {
  const history = useHistory();
  const formObject = useForm<FormValues>({
    defaultValues: {
      items: [defaultItem],
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log({ values });
  };
  return (
    <div className="row">
      <div className="col-lg-8">
        <h3>Approve restricted gear rental</h3>
        <Form onSubmit={onSubmit} form={formObject}>
          <LabeledInput
            title="Renter:"
            name="renter"
            renderComponent={({ value, onChange, onBlur, invalid }: any) => {
              return (
                <PersonSelect
                  value={value}
                  onChange={onChange}
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
            renderComponent={({ value, onChange, onBlur, invalid }: any) => {
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
            renderComponent={({ value, onChange, onBlur, invalid }: any) => {
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
      </div>
    </div>
  );
}
