import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { PurchasableItem, getPurchasableList } from "apiClient/gear";
import {
  Person,
  getPerson,
  getAffiliations,
  Affiliation,
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
}

const initialState: CacheState = {
  purchasableItems: { status: LoadingStatus.idle },
  affiliations: { status: LoadingStatus.idle },
  people: {},
};

export const fetchPurchasableItems = createAsyncThunk(
  "cache/fetchPurchasableItems",
  getPurchasableList
);

export const fetchPerson = createAsyncThunk("cache/fetchPerson", getPerson);

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
      });
  },
});

export default authSlice.reducer;
