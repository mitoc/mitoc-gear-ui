import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { loggedIn } from "../../apiClient/loggedIn";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isDeskworker: boolean;
}

export interface AuthState {
  loadingStatus: "loading" | "idle";
  loggedIn?: boolean;
  user?: User;
}

const initialState: AuthState = { loadingStatus: "idle" };

export const checkLoggedIn = createAsyncThunk(
  "auth/checkLoggedIn",
  async () => {
    return loggedIn();
  }
);

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
      });
  },
});

export const { fetchLoginStatus } = authSlice.actions;
export default authSlice.reducer;
