import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Person } from "apiClient/people";
import { GearItem } from "apiClient/gear";

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
    getGearItem: builder.query<GearItem, string>({
      query: (gearItemID) => `gear/${gearItemID}/`,
    }),
  }),
});

export const { useGetPersonQuery, useGetGearItemQuery } = gearDbApi;
