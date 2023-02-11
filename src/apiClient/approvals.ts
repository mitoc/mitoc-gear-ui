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

type ApprovalItem =
  | {
      type: "gearType";
      item: {
        quantity: number;
        gearType: GearType;
      };
    }
  | {
      type: "specificItem";
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
