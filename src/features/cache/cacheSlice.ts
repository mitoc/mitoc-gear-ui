import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getPurchasableList, getGearList } from "apiClient/gear";
import { getAffiliations, getPerson, getPersonList } from "apiClient/people";

import { LoadingStatus, CacheState } from "./types";
import {
  markPeoplePageLoading,
  markPeoplePageFetched,
  markGearPageLoading,
  markGearPageFetched,
} from "./paginatedQueryState";

const initialState: CacheState = {
  purchasableItems: { status: LoadingStatus.idle },
  affiliations: { status: LoadingStatus.idle },
  people: {},
  peopleSets: {},
  gearSets: {},
};

export const fetchPurchasableItems = createAsyncThunk(
  "cache/fetchPurchasableItems",
  getPurchasableList
);

export const fetchPerson = createAsyncThunk("cache/fetchPerson", getPerson);

export const fetchPersonList = createAsyncThunk(
  "cache/fetchPersonList",
  getPersonList
);

export const fetchGearList = createAsyncThunk("cache/getGearList", getGearList);

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
        markPeoplePageLoading(
          state,
          action.meta.arg.q ?? "",
          action.meta.arg.page ?? 1
        );
      })
      .addCase(fetchPersonList.fulfilled, (state, action) => {
        markPeoplePageFetched(
          state,
          action.meta.arg.q ?? "",
          action.meta.arg.page ?? 1,
          action.payload
        );
      })
      .addCase(fetchGearList.pending, (state, action) => {
        markGearPageLoading(
          state,
          action.meta.arg.q ?? "",
          action.meta.arg.page ?? 1
        );
      })
      .addCase(fetchGearList.fulfilled, (state, action) => {
        markGearPageFetched(
          state,
          action.meta.arg.q ?? "",
          action.meta.arg.page ?? 1,
          action.payload
        );
      });
  },
});

export default authSlice.reducer;
