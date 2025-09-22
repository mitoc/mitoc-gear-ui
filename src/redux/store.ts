import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import { gearDbApi, TagType } from "./api";
import authReducer from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [gearDbApi.reducerPath]: gearDbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gearDbApi.middleware),
});

// Set up a broacast channel for cross-tab invalidation
const updateChannel =
  "BroadcastChannel" in window ? new BroadcastChannel("rtk-sync") : undefined;

type EventType = { tags: TagType[] };

export function invalidateCache(tags: TagType[]) {
  store.dispatch(gearDbApi.util.invalidateTags(tags));
  updateChannel?.postMessage({ tags } satisfies EventType);
}

if (updateChannel != null) {
  updateChannel.onmessage = (e: MessageEvent<EventType>) => {
    store.dispatch(gearDbApi.util.invalidateTags(e.data.tags));
  };
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
