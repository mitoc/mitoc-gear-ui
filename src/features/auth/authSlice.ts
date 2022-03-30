import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { authClient } from "apiClient/auth";
import type { User, ApiError } from "apiClient/types";

import { createCustomAsyncThunk } from "./../tools";
export interface AuthState {
  loadingStatus: "loading" | "idle" | "blank";
  loggedIn?: boolean;
  user?: User;
  error?: ApiError;
}

const initialState: AuthState = { loadingStatus: "blank" };

export const checkLoggedIn = createAsyncThunk(
  "auth/checkLoggedIn",
  authClient.loggedIn
);

export const logIn = createCustomAsyncThunk("auth/logIn", authClient.logIn);
export const logOut = createAsyncThunk("auth/logOut", authClient.logOut);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkLoggedIn.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(checkLoggedIn.fulfilled, (state, action) => {
        state.loadingStatus = "idle";
        state.loggedIn = action.payload.loggedIn;
        state.user = action.payload.user;
      })
      .addCase(logIn.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loadingStatus = "idle";
        state.loggedIn = true;
        state.user = action.payload as User;
        delete state.error;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loadingStatus = "idle";
        state.error = action.payload as ApiError;
      })
      .addCase(logOut.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loadingStatus = "idle";
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.loadingStatus = "idle";
        delete state.user;
        state.loggedIn = false;
      });
  },
});

export default authSlice.reducer;
