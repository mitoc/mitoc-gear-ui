import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import styled from "styled-components";

import { ApprovalItemType, PartialApprovalItem } from "src/apiClient/approvals";
import { GearItemID } from "src/apiClient/idTypes";
import { PersonBase } from "src/apiClient/people";
import { GearItemSelect } from "src/components/GearItemSelect";
import { GearTypeSelect } from "src/components/GearTypeSelect";
import { makeLabeledInput } from "src/components/Inputs/LabeledInput";
import { Select } from "src/components/Select";

import { FormValues } from "./types";

const LabeledInput = makeLabeledInput<FormValues>();

type Props = {
  alreadyApprovedItems: { id: GearItemID; renter: PersonBase }[];
};

export function ApprovalItemsPicker({ alreadyApprovedItems }: Props) {
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

  // Helper function to check if an item has a conflict
  const getConflictForItem = (itemIndex: number) => {
    const item = items[itemIndex];
    if (item.type !== ApprovalItemType.specificItem) {
      return null;
    }

    const gearItemId = item.item.gearItem;
    if (!gearItemId) {
      return null;
    }

    const approvedItem = alreadyApprovedItems.find(
      (approved) => approved.id === gearItemId,
    );

    return approvedItem || null;
  };

  return (
    <fieldset>
      <legend className="h6 fw-semibold text-secondary mb-3">
        Items approved
      </legend>
      {itemFields.map((field, index) => {
        const conflict = getConflictForItem(index);
        return (
          <StyledItem key={field.id}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <strong>Item #{index + 1}</strong>
              <div className="d-flex align-items-center gap-2">
                {conflict && (
                  <span className="badge bg-warning text-dark">
                    ‼️ Approved for {conflict.renter.firstName}{" "}
                    {conflict.renter.lastName}
                  </span>
                )}
                {items.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => remove(index)}
                    aria-label="Remove item"
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                )}
              </div>
            </div>
            <Controller
              control={formObject.control}
              name={`items.${index}.type`}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <ApprovalTypePicker
                    value={value}
                    onChange={(v) => {
                      if (v === ApprovalItemType.specificItem) {
                        formObject.setValue(
                          `items.${index}`,
                          defaultSpecificItem,
                        );
                      }
                      formObject.setValue(`items.${index}`, defaultItem);
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
                  name={`items.${index}.item.gearType` as const}
                  renderComponent={({ value, onChange, invalid }) => {
                    return (
                      <GearTypeSelect
                        value={value ?? null}
                        onChange={(val) => onChange(val?.id)}
                        invalid={invalid}
                        restrictedOnly={true}
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
                  inputStyle={{ width: "120px" }}
                  options={{
                    required: true,
                    valueAsNumber: true,
                  }}
                />
              </>
            ) : (
              <LabeledInput
                title="Item:"
                name={`items.${index}.item.gearItem` as const}
                renderComponent={({ value, onChange, invalid }) => {
                  return (
                    <GearItemSelect
                      value={value ?? null}
                      onChange={(val) => onChange(val?.id)}
                      invalid={invalid}
                      filters={{ restricted: true }}
                      renderBadge={(gear) => {
                        const approvedItem = alreadyApprovedItems.find(
                          (item) => item.id === gear.id,
                        );

                        if (!approvedItem) {
                          return undefined;
                        }

                        return {
                          text: `‼️ Approved for ${approvedItem.renter.firstName} ${approvedItem.renter.lastName}`,
                          variant: "warning",
                        };
                      }}
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
      <div className="mt-2">
        <button
          className="btn btn-link p-0 text-decoration-none fw-medium"
          onClick={() => append(defaultItem)}
          type="button"
        >
          + Approve another item
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

const defaultSpecificItem: PartialApprovalItem = {
  type: ApprovalItemType.specificItem,
  item: {
    gearItem: undefined,
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
  border: solid 1px #dee2e6;
  border-radius: 0.5rem;
  background-color: #f8f9fa;
  padding: 1.25rem !important;
  margin-bottom: 1rem !important;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;
