import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { authClient } from "apiClient/auth";
import type { APIErrorType, User } from "apiClient/types";

import { createCustomAsyncThunk } from "../tools";

export interface AuthState {
  loadingStatus: "loading" | "idle" | "blank";
  loggedIn?: boolean;
  user?: User;
  error?: APIErrorType;
}

const initialState: AuthState = { loadingStatus: "blank" };

export const checkLoggedIn = createCustomAsyncThunk(
  "auth/checkLoggedIn",
  authClient.loggedIn,
);

export const logIn = createCustomAsyncThunk("auth/logIn", authClient.logIn);
export const signInWithGoogle = createCustomAsyncThunk(
  "auth/signInWithGoogle",
  authClient.signInWithGoogle,
);
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
      .addCase(checkLoggedIn.rejected, (state, action) => {
        state.loadingStatus = "idle";
        if (action.payload == null) {
          state.error = {
            msg: "Unable to reach API server. Please try again later and/or contact mitoc-webmaster@mit.edu",
            err: "unavailableServer",
          };
          return;
        }
        const payload = action.payload as APIErrorType;
        if (payload.err == "userDoesNotMatchPerson") {
          state.error = {
            msg: "This user account is not associated with a desk worker person. Please contact mitoc-desk@mit.edu to fix the issue.",
            err: payload.err,
          };
          return;
        }
        if (payload != null) {
          state.error = payload;
        }
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
        state.error = action.payload as APIErrorType;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loadingStatus = "idle";
        state.loggedIn = true;
        state.user = action.payload as User;
        delete state.error;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loadingStatus = "idle";
        state.error = action.payload as APIErrorType;
      })
      .addCase(logOut.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(logOut.rejected, (state) => {
        state.loadingStatus = "idle";
      })
      .addCase(logOut.fulfilled, (state) => {
        state.loadingStatus = "idle";
        delete state.user;
        state.loggedIn = false;
      });
  },
});

export default authSlice.reducer;
