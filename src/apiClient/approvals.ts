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

type GearTypeApproval = GenericGearTypeApproval<GearType>;
type SpecificItemApproval = GenericSpecificItemApproval<GearItem>;
type PartialGearTypeApproval = GenericGearTypeApproval<GearType | undefined>;
type PartialSpecificItemApproval = GenericSpecificItemApproval<
  GearItem | undefined
>;
export type ApprovalItem = GearTypeApproval | SpecificItemApproval;
export type PartialApprovalItem =
  | PartialGearTypeApproval
  | PartialSpecificItemApproval;

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
  note: string;
  renter: string;
  items: ApprovalItem[];
};

export async function createNewApproval(approval: CreateNewApprovalArgs) {
  const { renter, startDate, endDate, items, note } = approval;
  const body = {
    note,
    //TODO: helper for this formatting
    endDate: endDate.toISOString().split("T")[0],
    startDate: startDate.toISOString().split("T")[0],
    items: items.map((item) => ({
      type: item.type,
      item:
        item.type === ApprovalItemType.gearType
          ? { ...item.item, gearType: item.item.gearType.id }
          : { ...item.item, gearItem: item.item.gearItem.id },
    })),
  };
  return request(`/people/${renter}/approvals/`, "POST", body);
}
