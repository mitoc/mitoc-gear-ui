import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { PurchasableItem, getPurchasableList } from "apiClient/gear";
import {
  Affiliation,
  getAffiliations,
  getPerson,
  getPersonList,
  Person,
  PersonSummary,
} from "apiClient/people";

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
  peopleSets: {
    [queryKey: string]: {
      status: LoadingStatus;
      number?: number;
      results: {
        [page: number]: { status: LoadingStatus; value?: PersonSummary[] };
      };
    };
  };
}

const initialState: CacheState = {
  purchasableItems: { status: LoadingStatus.idle },
  affiliations: { status: LoadingStatus.idle },
  people: {},
  peopleSets: {},
};

export const fetchPurchasableItems = createAsyncThunk(
  "cache/fetchPurchasableItems",
  getPurchasableList
);

export const fetchPerson = createAsyncThunk("cache/fetchPerson", getPerson);

export const fetchPersonList = createAsyncThunk(
  "cache/fetchPeople",
  getPersonList
);

export const fetchAffiliations = createAsyncThunk(
  "cache/fetchAffiliations",
  getAffiliations
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchasableItems.pending, (state) => {
        state.purchasableItems.status = LoadingStatus.loading;
      })
      .addCase(fetchPurchasableItems.fulfilled, (state, action) => {
        state.purchasableItems.status = LoadingStatus.idle;
        state.purchasableItems.value = action.payload;
      })
      .addCase(fetchAffiliations.pending, (state) => {
        state.affiliations.status = LoadingStatus.loading;
      })
      .addCase(fetchAffiliations.fulfilled, (state, action) => {
        state.affiliations.status = LoadingStatus.idle;
        state.affiliations.value = action.payload;
      })
      .addCase(fetchPerson.pending, (state, action) => {
        state.people[action.meta.arg] = {
          ...(state.people[action.meta.arg] ?? {}),
          ...{ status: LoadingStatus.loading },
        };
      })
      .addCase(fetchPerson.fulfilled, (state, action) => {
        state.people[action.meta.arg] = {
          ...(state.people[action.meta.arg] ?? {}),
          ...{ status: LoadingStatus.idle, value: action.payload },
        };
      })
      .addCase(fetchPersonList.pending, (state, action) => {
        const q = action.meta.arg.q ?? "";
        const currentSet = state.peopleSets[q] ?? { results: {} };
        if (currentSet.number == null) {
          currentSet.status = LoadingStatus.loading;
        }
        currentSet.results[action.meta.arg.page ?? 1] = {
          status: LoadingStatus.loading,
        };
        state.peopleSets[q] = currentSet;
      })
      .addCase(fetchPersonList.fulfilled, (state, action) => {
        const q = action.meta.arg.q ?? "";
        const currentSet = state.peopleSets[q] ?? { results: {} };
        currentSet.status = LoadingStatus.idle;
        currentSet.number = action.payload.count;
        currentSet.results[action.meta.arg.page ?? 1] = {
          status: LoadingStatus.idle,
          value: action.payload.results,
        };
        state.peopleSets[q] = currentSet;
      });
  },
});

export default authSlice.reducer;
