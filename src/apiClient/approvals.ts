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

export async function addNewApproval(approval: Approval) {}
