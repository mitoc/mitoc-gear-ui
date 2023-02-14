import { useForm, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";

import { LabeledInput } from "components/Inputs/LabeledInput";
import { Form } from "components/Inputs/Form";
import { PersonSelect } from "components/PersonSelect";
import { ApprovalItem, ApprovalItemType } from "apiClient/approvals";
import { Select } from "components/Select";

type FormValues = { items: ApprovalItem[] };

export function AddNewApproval() {
  const formObject = useForm<FormValues>({
    defaultValues: { items: [{ type: ApprovalItemType.gearType }] },
  });
  const {
    fields: itemFields,
    append,
    prepend,
    remove,
    swap,
    move,
    insert,
  } = useFieldArray({
    control: formObject.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "items", // unique name for your Field Array
  });

  const onSubmit = (values: FormValues) => {};
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
                  className={`w-100 flex-grow-1 ${invalid ? "is-invalid" : ""}`}
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
          <fieldset>
            Items:
            {itemFields.map((field, index) => (
              <Controller
                key={field.id}
                control={formObject.control}
                name={`items.${index}`}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => {
                  return (
                    <ApprovalTypePicker
                      value={value.type}
                      onChange={(newType) => {
                        onChange({ ...value, type: newType });
                      }}
                    />
                  );
                }}
              />
            ))}
          </fieldset>
          <LabeledInput title="Note:" as="textarea" name="note" />

          <div className="d-flex justify-content-between mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              // onClick={onCancel}
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

const approvalTypeOptions = [
  {
    value: ApprovalItemType.gearType,
    label: "Gear type",
  },
  {
    value: ApprovalItemType.specificItem,
    label: "Specific item",
  },
];

function ApprovalTypePicker({
  onChange,
  value,
}: {
  onChange: (value: ApprovalItemType | undefined) => void;
  value: ApprovalItemType;
}) {
  const selectedOption = approvalTypeOptions.find((o) => o.value === value);
  return (
    <Select
      onChange={(newType) => onChange(newType?.value)}
      value={selectedOption}
      options={approvalTypeOptions}
    />
  );
}
