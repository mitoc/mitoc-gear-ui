import type { PurchasableItem } from "src/apiClient/gear";

export type ItemToPurchase =
  | { id: string; kind: "catalog"; item: PurchasableItem }
  | { id: string; kind: "custom"; description: string; price: number };
