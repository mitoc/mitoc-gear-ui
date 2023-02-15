import type {
  CreateNewApprovalArgs,
  PartialApprovalItem,
} from "apiClient/approvals";

export type FormValues = Omit<Partial<CreateNewApprovalArgs>, "items"> & {
  items: PartialApprovalItem[];
};
