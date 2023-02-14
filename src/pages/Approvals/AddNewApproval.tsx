import { useForm, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { LabeledInput } from "components/Inputs/LabeledInput";
import { Form } from "components/Inputs/Form";
import { PersonSelect } from "components/PersonSelect";
import {
  ApprovalItemType,
  PartialApproval,
  PartialApprovalItem,
} from "apiClient/approvals";
import { Select } from "components/Select";
import { GearTypeSelect } from "components/GearTypeSelect";
import { GearItemSelect } from "components/GearItemSelect";
import styled from "styled-components";

type FormValues = PartialApproval;

const defaultItem: PartialApprovalItem = {
  type: ApprovalItemType.gearType,
  item: {
    quantity: 1,
    gearType: undefined,
  },
};

// TODO: Cancel button should bring you back to previous page
// TODO: Validate dates are in the right order
// TODO: Handle submit

export function AddNewApproval() {
  const formObject = useForm<FormValues>({
    defaultValues: {
      items: [defaultItem],
    },
  });
  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control: formObject.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "items", // unique name for your Field Array
  });

  const onSubmit = (values: FormValues) => {
    console.log({ values });
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
            Items approved:
            {itemFields.map((field, index) => {
              return (
                <StyledItem key={field.id} className="p-2 mb-3 mt-3">
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Item #{index + 1}</strong>
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => remove(index)}
                        style={{
                          borderColor: "#ced4da",
                        }}
                      >
                        <FontAwesomeIcon icon={faClose} />
                      </button>
                    )}
                  </div>
                  <Controller
                    control={formObject.control}
                    name={`items.${index}.type`}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value, ref } }) => {
                      return (
                        <ApprovalTypePicker
                          value={value}
                          onChange={(v) => {
                            formObject.resetField(`items.${index}`);
                            onChange(v);
                          }}
                          onBlur={onBlur}
                        />
                      );
                    }}
                  />
                  {items[index].type === ApprovalItemType.gearType ? (
                    <>
                      <LabeledInput
                        title="Type:"
                        name={`items.${index}.item.gearType`}
                        renderComponent={({
                          value,
                          onChange,
                          invalid,
                        }: any) => {
                          return (
                            <GearTypeSelect
                              value={value ?? null}
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
                        title="Quantity approved"
                        type="number"
                        name={`items.${index}.item.quantity`}
                        step={1}
                        options={{
                          valueAsNumber: true,
                        }}
                      />
                    </>
                  ) : (
                    <LabeledInput
                      title="Item:"
                      name={`items.${index}.item.gearItem`}
                      renderComponent={({ value, onChange, invalid }: any) => {
                        return (
                          <GearItemSelect
                            value={value?.id ?? null}
                            onChange={onChange}
                            invalid={invalid}
                          />
                        );
                      }}
                      options={{
                        required: true,
                      }}
                    />
                  )}
                </StyledItem>
              );
            })}
            <div className="mt-2 d-flex justify-content-end">
              <button
                className="btn btn-outline-primary"
                onClick={() => append(defaultItem)}
                type="button"
              >
                Add item
              </button>
            </div>
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

const StyledItem = styled.div`
  margin-left: 30px;
  border: solid 1px #ced4da;
  border-radius: 0.375rem;
  background-color: #f8f8f8;
`;
