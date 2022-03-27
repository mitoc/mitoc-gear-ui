import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { PurchasableItem, getPurchasableList } from "apiClient/gear";

export interface CacheState {
  purchasableItems: {
    status: "loading" | "idle";
    value?: PurchasableItem[];
  };
}

const initialState: CacheState = {
  purchasableItems: { status: "idle" },
};

export const fetchPurchasableItems = createAsyncThunk(
  "cache/fetchPurchasableItems",
  getPurchasableList
);

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
      });
  },
});

export default authSlice.reducer;
