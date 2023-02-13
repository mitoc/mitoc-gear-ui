export interface Approval {
  id: number;
  startDate: string;
  endDate: string;
  note: string;
  approvedBy: Person;
  renter: Person;
  items: ApprovalItem[];
}

interface GearItem {
  id: string;
  type: GearType;
}

export enum ApprovalItemType {
  gearType = "gearType",
  specificItem = "specificItem",
}

export type ApprovalItem =
  | {
      type: ApprovalItemType.gearType;
      item: {
        quantity: number;
        gearType: GearType;
      };
    }
  | {
      type: ApprovalItemType.specificItem;
      item: {
        gearItem: GearItem;
      };
    };

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
