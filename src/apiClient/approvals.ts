import { toIsoDate } from "lib/fmtDate";
import { request } from "./client";

interface GenericApproval<T> {
  id: number;
  startDate: string;
  endDate: string;
  note: string;
  approvedBy: Person;
  renter: Person;
  items: T[];
}

export type Approval = GenericApproval<ApprovalItem>;
export type PartialApproval = GenericApproval<PartialApprovalItem>;

interface GearItem {
  id: string;
  type: GearType;
}

export enum ApprovalItemType {
  gearType = "gearType",
  specificItem = "specificItem",
}

type GenericGearTypeApproval<T> = {
  type: ApprovalItemType.gearType;
  item: {
    quantity: number;
    gearType: T;
  };
};

type GenericSpecificItemApproval<T> = {
  type: ApprovalItemType.specificItem;
  item: {
    gearItem: T;
  };
};

export type ApprovalItem =
  | GenericGearTypeApproval<GearType>
  | GenericSpecificItemApproval<GearItem>;

export type PartialApprovalItem =
  | GenericGearTypeApproval<number | undefined>
  | GenericSpecificItemApproval<string | undefined>;

export type ApprovalItemToCreate =
  | GenericGearTypeApproval<number>
  | GenericSpecificItemApproval<string>;

interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

interface GearType {
  id: number;
  typeName: string;
  shorthand: string;
}

export type CreateNewApprovalArgs = {
  startDate: Date;
  endDate: Date;
  note?: string;
  renter: string;
  items: ApprovalItemToCreate[];
};

export async function createNewApproval(approval: CreateNewApprovalArgs) {
  const { renter, startDate, endDate, items, note } = approval;
  const body = {
    note,
    endDate: toIsoDate(endDate),
    startDate: toIsoDate(startDate),
    items: items.map((item) => ({
      type: item.type,
      item:
        item.type === ApprovalItemType.gearType
          ? { ...item.item, gearType: item.item.gearType }
          : { ...item.item, gearItem: item.item.gearItem },
    })),
  };
  return request(`/people/${renter}/approvals/`, "POST", body);
}

export async function deleteApproval(approvalID: number) {
  return request(`/approvals/${approvalID}/`, "DELETE");
}
