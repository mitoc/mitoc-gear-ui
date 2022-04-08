import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getPurchasableList, getGearList } from "apiClient/gear";
import { getAffiliations, getPersonList } from "apiClient/people";

import { LoadingStatus, CacheState } from "./types";
import {
  markGearPageLoading,
  markGearPageFetched,
} from "./paginatedQueryState";

const initialState: CacheState = {
  purchasableItems: { status: LoadingStatus.idle },
  affiliations: { status: LoadingStatus.idle },
  peopleSets: {},
  gearSets: {},
};

export const fetchPurchasableItems = createAsyncThunk(
  "cache/fetchPurchasableItems",
  getPurchasableList
);

export const fetchGearList = createAsyncThunk(
  "cache/fetchGearList",
  getGearList
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
      .addCase(fetchGearList.pending, (state, action) => {
        const { page, ...otherArgs } = action.meta.arg;
        markGearPageLoading(state, JSON.stringify(otherArgs), page ?? 1);
      })
      .addCase(fetchGearList.fulfilled, (state, action) => {
        const { page, ...otherArgs } = action.meta.arg;
        markGearPageFetched(
          state,
          JSON.stringify(otherArgs),
          page ?? 1,
          action.payload
        );
      });
  },
});

export default authSlice.reducer;
