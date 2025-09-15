import type {
  CreateNewApprovalArgs,
  PartialApprovalItem,
} from "src/apiClient/approvals";

export type FormValues = Omit<Partial<CreateNewApprovalArgs>, "items"> & {
  items: PartialApprovalItem[];
};
