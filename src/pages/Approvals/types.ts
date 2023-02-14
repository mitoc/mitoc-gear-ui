import type {
  CreateNewApprovalArgs,
  PartialApprovalItem,
} from "apiClient/approvals";

export type FormValues = Omit<CreateNewApprovalArgs, "items"> & {
  items: PartialApprovalItem[];
};
