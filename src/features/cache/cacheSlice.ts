import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { PurchasableItem, getPurchasableList } from "apiClient/gear";
import { Person, getPerson } from "apiClient/people";

export enum LoadingStatus {
  "loading" = "loading",
  "idle" = "idle",
}

export interface CacheState {
  purchasableItems: {
    status: "loading" | "idle";
    value?: PurchasableItem[];
  };
  people: {
    [id: string]: {
      status: LoadingStatus;
      value?: Person;
    };
  };
}

const initialState: CacheState = {
  purchasableItems: { status: "idle" },
  people: {},
};

export const fetchPurchasableItems = createAsyncThunk(
  "cache/fetchPurchasableItems",
  getPurchasableList
);

export const fetchPerson = createAsyncThunk("cache/fetchPerson", getPerson);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchasableItems.pending, (state) => {
        state.purchasableItems.status = "loading";
      })
      .addCase(fetchPurchasableItems.fulfilled, (state, action) => {
        state.purchasableItems.status = "idle";
        state.purchasableItems.value = action.payload;
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
