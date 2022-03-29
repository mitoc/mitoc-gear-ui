import type { PurchasableItem, GearSummary, GearItem } from "apiClient/gear";
import type { Affiliation, Person, PersonSummary } from "apiClient/people";

export enum LoadingStatus {
  "loading" = "loading",
  "idle" = "idle",
}

export interface CacheState {
  purchasableItems: {
    status: LoadingStatus;
    value?: PurchasableItem[];
  };
  affiliations: {
    status: LoadingStatus;
    value?: Affiliation[];
  };
  people: {
    [id: string]: {
      status: LoadingStatus;
      value?: Person;
    };
  };
  gear: {
    [id: string]: {
      status: LoadingStatus;
      value?: GearItem;
    };
  };
  peopleSets: PaginatedQueryState<"peopleSets">;
  gearSets: PaginatedQueryState<"gearSets">;
}

export type SetsKey = "peopleSets" | "gearSets";

export type ValueList<K extends SetsKey> = K extends "peopleSets"
  ? PersonSummary[]
  : GearSummary[];

export interface PaginatedQueryState<K extends SetsKey> {
  [queryKey: string]: {
    status: LoadingStatus;
    number?: number;
    results: {
      [page: number]: { status: LoadingStatus; value?: ValueList<K> };
    };
  };
}
