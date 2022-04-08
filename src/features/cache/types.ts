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
  peopleSets: PaginatedQueryState<PersonSummary>;
  gearSets: PaginatedQueryState<GearSummary>;
}

export interface PaginatedQueryState<T> {
  [queryKey: string]: {
    status: LoadingStatus;
    number?: number;
    results: {
      [page: number]: { status: LoadingStatus; value?: T[] };
    };
  };
}
