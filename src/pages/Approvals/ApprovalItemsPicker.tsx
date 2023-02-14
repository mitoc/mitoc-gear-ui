import { useFieldArray, Controller, useFormContext } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import { LabeledInput } from "components/Inputs/LabeledInput";
import { ApprovalItemType, PartialApprovalItem } from "apiClient/approvals";
import { Select } from "components/Select";
import { GearTypeSelect } from "components/GearTypeSelect";
import { GearItemSelect } from "components/GearItemSelect";

import { FormValues } from "./types";

export function ApprovalItemsPicker() {
  const formObject = useFormContext<FormValues>();
  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control: formObject.control,
    name: "items",
  });
  const items = formObject.watch("items");
  return (
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
                  renderComponent={({ value, onChange, invalid }: any) => {
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
  );
}

export const defaultItem: PartialApprovalItem = {
  type: ApprovalItemType.gearType,
  item: {
    quantity: 1,
    gearType: undefined,
  },
};

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
