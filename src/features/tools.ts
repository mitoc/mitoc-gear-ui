import { AsyncThunkPayloadCreator, createAsyncThunk } from "@reduxjs/toolkit";

import { APIError as APIErrorClass } from "apiClient/client";

function wrapper<R, Arg>(
  fn: (arg: Arg) => Promise<R>
): AsyncThunkPayloadCreator<R, Arg> {
  return async (arg: Arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (err) {
      if (err instanceof APIErrorClass) {
        return rejectWithValue(err.error);
      }
      throw err;
    }
  };
}

export function createCustomAsyncThunk<R, Arg>(
  actionName: string,
  fn: (arg: Arg) => Promise<R>
) {
  return createAsyncThunk(actionName, wrapper(fn));
}
