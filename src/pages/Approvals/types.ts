import type { PartialApprovalItem } from "apiClient/approvals";

export type FormValues = {
  id: number;
  startDate: Date;
  endDate: Date;
  note: string;
  renter: string;
  items: PartialApprovalItem[];
};
