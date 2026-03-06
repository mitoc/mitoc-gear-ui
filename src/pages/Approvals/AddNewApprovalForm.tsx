import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Approval,
  ApprovalItemToCreate,
  ApprovalItemType,
  CreateNewApprovalArgs,
} from "src/apiClient/approvals";
import { GearItemID } from "src/apiClient/idTypes";
import { Form } from "src/components/Inputs/Form";
import { makeLabeledInput } from "src/components/Inputs/LabeledInput";
import { PersonSelect } from "src/components/PersonSelect";
import { useGetApprovalsQuery } from "src/redux/api";

import { ApprovalItemsPicker, defaultItem } from "./ApprovalItemsPicker";
import { FormValues } from "./types";

type Props = {
  onSubmit: (args: CreateNewApprovalArgs) => void;
};

const LabeledInput = makeLabeledInput<FormValues>();

export function AddNewApprovalForm({ onSubmit }: Props) {
  const { data: existingApprovals } = useGetApprovalsQuery({
    past: false, //
  });
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const personId = searchParams.get("personId");

  const today = dayjs().startOf("day").toDate();
  const defaultEndDate = nextTuesday(today);
  const formObject = useForm<FormValues>({
    defaultValues: {
      items: [defaultItem],
      renter: personId ?? undefined,
      startDate: dayjs().startOf("day").toDate(),
      endDate: defaultEndDate,
    },
  });

  const handleSubmit = (values: FormValues) => {
    const validatedValues = validateApproval(values);
    onSubmit(validatedValues);
  };
  const startDate = formObject.watch("startDate");
  const endDate = formObject.watch("endDate");

  const alreadyApprovedItems = getAlreadyApprovedItems(
    existingApprovals?.results ?? [],
    startDate,
    endDate,
  );

  return (
    <Form onSubmit={handleSubmit} form={formObject}>
      <LabeledInput
        title="Renter:"
        name="renter"
        renderComponent={({ value, onChange, invalid }) => {
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
              onChange={(val) => onChange(val ?? undefined)}
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
              onChange={(val) => onChange(val ?? undefined)}
              className={`form-control ${invalid ? "is-invalid" : ""}`}
              wrapperClassName={invalid ? "is-invalid" : ""}
              onBlur={onBlur}
            />
          );
        }}
        options={{
          required: true,
          validate: (value) => {
            if (startDate != null && value != null && value < startDate) {
              return "The approval end date cannot be before the start date.";
            }
          },
        }}
      />
      <ApprovalItemsPicker alreadyApprovedItems={alreadyApprovedItems} />

      <LabeledInput title="Note:" as="textarea" name="note" />

      <div className="d-flex justify-content-between mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
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

function nextTuesday(from: Date): Date {
  const today = dayjs(from);
  // Ensure a weekend has passed
  const nextSunday = today.day(7);
  return nextSunday.day(2).toDate();
}

function getAlreadyApprovedItems(
  existingApprovals: Approval[],
  startDate: Date | undefined,
  endDate: Date | undefined,
): { id: GearItemID; renter: Approval["renter"] }[] {
  if (!startDate || !endDate) {
    return [];
  }

  return existingApprovals
    .filter((approval) => {
      const approvalStart = dayjs(approval.startDate);
      const approvalEnd = dayjs(approval.endDate);
      const selectedStart = dayjs(startDate);
      const selectedEnd = dayjs(endDate);
      return (
        approvalStart.isBefore(selectedEnd) &&
        approvalEnd.isAfter(selectedStart)
      );
    })
    .flatMap((approval) =>
      approval.items
        .filter((item) => item.type === ApprovalItemType.specificItem)
        .map((item) => ({
          id: item.item.gearItem.id,
          renter: approval.renter,
        })),
    );
}

function validateApproval(approval: FormValues): CreateNewApprovalArgs {
  const { startDate, endDate, renter, items, note } = approval;
  if (
    startDate != null &&
    endDate != null &&
    renter != null &&
    items.every((item) => {
      if (item.type === ApprovalItemType.gearType) {
        return item.item.gearType != null;
      }
      return item.item.gearItem != null;
    })
  ) {
    return {
      startDate,
      endDate,
      renter,
      items: items as ApprovalItemToCreate[],
      note,
    };
  }
  // This case should not happen, the validation should handle it
  throw Error("Missing required fields");
}
