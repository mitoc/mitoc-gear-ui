import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { useGetConfigQuery } from "./api";
import type { AppDispatch, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useConfig() {
  const { data: config } = useGetConfigQuery();
  return config ?? {};
}
