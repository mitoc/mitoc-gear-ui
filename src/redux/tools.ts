import { AsyncThunkPayloadCreator, createAsyncThunk } from "@reduxjs/toolkit";

import { APIError as APIErrorClass } from "apiClient/client";

type EmptyObject = Record<string, never>;
function wrapper<R, Arg>(fn: AsyncThunkPayloadCreator<R, Arg, EmptyObject>) {
  return (async (arg: Arg, api) => {
    try {
      return await fn(arg, api);
    } catch (err) {
      if (err instanceof APIErrorClass) {
        return api.rejectWithValue(err.error);
      }
      throw err;
    }
  }) as AsyncThunkPayloadCreator<R, Arg>;
}

export function createCustomAsyncThunk<R, Arg = void>(
  actionName: string,
  fn: AsyncThunkPayloadCreator<R, Arg, EmptyObject>,
) {
  return createAsyncThunk(actionName, wrapper(fn));
}
