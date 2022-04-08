import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Person, PersonSummary } from "apiClient/people";
import { GearItem } from "apiClient/gear";
import { ListWrapper } from "apiClient/types";

export const gearDbApi = createApi({
  reducerPath: "gearDbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/v1",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getPerson: builder.query<Person, string>({
      query: (personID) => `people/${personID}/`,
    }),
    getPersonList: builder.query<
      ListWrapper<PersonSummary>,
      {
        q?: string;
        page?: number;
      }
    >({
      query: ({ q, page }) => ({
        url: "people/",
        params: { q, page },
      }),
    }),
    getGearItem: builder.query<GearItem, string>({
      query: (gearItemID) => `gear/${gearItemID}/`,
    }),
  }),
});

export const {
  useGetPersonQuery,
  useGetPersonListQuery,
  useGetGearItemQuery,
} = gearDbApi;
