import { AsyncThunkPayloadCreator, createAsyncThunk } from "@reduxjs/toolkit";

import { APIError as APIErrorClass } from "apiClient/client";

function wrapper<R, Arg>(
  fn: AsyncThunkPayloadCreator<R, Arg, {}>
): AsyncThunkPayloadCreator<R, Arg> {
  return async (arg: Arg, api) => {
    try {
      return await fn(arg, api);
    } catch (err) {
      if (err instanceof APIErrorClass) {
        return api.rejectWithValue(err.error);
      }
      throw err;
    }
  };
}

export function createCustomAsyncThunk<R, Arg = void>(
  actionName: string,
  fn: AsyncThunkPayloadCreator<R, Arg, {}>
) {
  return createAsyncThunk(actionName, wrapper(fn));
}
