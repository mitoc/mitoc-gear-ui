import { useForm, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";

import { LabeledInput } from "components/Inputs/LabeledInput";
import { Form } from "components/Inputs/Form";
import { PersonSelect } from "components/PersonSelect";
import { ApprovalItem, ApprovalItemType } from "apiClient/approvals";
import { Select } from "components/Select";
import { GearTypeSelect } from "components/GearTypeSelect";
import { GearItemSelect } from "components/GearItemSelect";

type FormValues = { items: ApprovalItem[] };

export function AddNewApproval() {
  const formObject = useForm<FormValues>({
    defaultValues: {
      items: [
        {
          type: ApprovalItemType.gearType,
          item: {},
        },
      ],
    },
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

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };
  const items = formObject.watch("items");
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
              <div key={field.id} style={{ marginLeft: "30px" }}>
                Item #{index + 1}
                <Controller
                  control={formObject.control}
                  name={`items.${index}.type`}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value, ref } }) => {
                    return (
                      <ApprovalTypePicker
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    );
                  }}
                />
                {items[index].type === ApprovalItemType.gearType ? (
                  <>
                    <label>Type</label>
                    <Controller
                      control={formObject.control}
                      name={`items.${index}.item.gearType`}
                      rules={{ required: true }}
                      render={({ field: { onChange, onBlur, value, ref } }) => {
                        return (
                          <GearTypeSelect value={value} onChange={onChange} />
                        );
                      }}
                    />
                    <LabeledInput
                      title="Quantity approved"
                      type="number"
                      name={`items.${index}.item.quantity`}
                      step={1}
                    />
                  </>
                ) : (
                  <>
                    <label>Item</label>
                    <Controller
                      control={formObject.control}
                      name={`items.${index}.item.gearItem`}
                      rules={{ required: true }}
                      render={({ field: { onChange, onBlur, value, ref } }) => {
                        return (
                          <GearItemSelect
                            value={value?.id}
                            onChange={onChange}
                          />
                        );
                      }}
                    />
                  </>
                )}
              </div>
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
    label: "Approve gear by type",
  },
  {
    value: ApprovalItemType.specificItem,
    label: "Approve a specific item",
  },
];

function ApprovalTypePicker({
  onChange,
  value,
  onBlur,
}: {
  onChange: (value: ApprovalItemType | undefined) => void;
  onBlur?: () => void;
  value: ApprovalItemType;
}) {
  const selectedOption = approvalTypeOptions.find((o) => o.value === value);
  return (
    <Select
      onChange={(newType) => onChange(newType?.value)}
      value={selectedOption}
      options={approvalTypeOptions}
      onBlur={onBlur}
    />
  );
}
