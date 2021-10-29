import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { authClient } from "apiClient/auth";
import type { User, ApiError } from "apiClient/types";

export interface AuthState {
  loadingStatus: "loading" | "idle" | "blank";
  loggedIn?: boolean;
  user?: User;
  error?: string;
}

const initialState: AuthState = { loadingStatus: "blank" };

export const checkLoggedIn = createAsyncThunk(
  "auth/checkLoggedIn",
  authClient.loggedIn
);

export const logIn = createAsyncThunk("auth/logIn", authClient.logIn);
export const logOut = createAsyncThunk("auth/logOut", authClient.logOut);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    fetchLoginStatus(state, action: PayloadAction<number>) {
      state.loadingStatus = "loading";
    },
  },
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
        if ((action.payload as ApiError).err != null) {
          state.error = (action.payload as ApiError).msg;
          return;
        }
        state.loggedIn = true;
        state.user = action.payload as User;
      })
      .addCase(logOut.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(logOut.rejected, (state, action) => {
        console.log(action.payload);
        state.loadingStatus = "idle";
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.loadingStatus = "idle";
        console.log(action.payload);
        delete state.user;
        state.loggedIn = false;
      });
  },
});

export const { fetchLoginStatus } = authSlice.actions;
export default authSlice.reducer;
