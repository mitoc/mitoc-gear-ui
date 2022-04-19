import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Person, PersonSummary, PeopleGroup } from "apiClient/people";
import type {
  GearItem,
  GearSummary,
  GearType,
  PurchasableItem,
} from "apiClient/gear";
import { Affiliations, ListWrapper } from "apiClient/types";

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
        openRentals?: boolean;
      }
    >({
      query: ({ q, page, openRentals }) => ({
        url: "people/",
        params: {
          ...(q && { q }),
          ...(page && { page }),
          ...(openRentals && { openRentals }),
        },
      }),
    }),
    getGearItem: builder.query<GearItem, string>({
      query: (gearItemID) => `gear/${gearItemID}/`,
    }),
    getGearList: builder.query<
      ListWrapper<GearSummary>,
      {
        q?: string;
        page?: number;
        includeRetired?: boolean;
      }
    >({
      query: ({ q, page, includeRetired }) => ({
        url: "gear/",
        params: {
          ...(q && { q }),
          ...(page && { page }),
          ...(!includeRetired && { retired: false }),
        },
      }),
    }),
    getPurchasables: builder.query<PurchasableItem[], void>({
      query: () => "/purchasable/",
    }),
    getAffiliations: builder.query<Affiliations[], void>({
      query: () => "/affiliations/",
    }),
    getGroups: builder.query<PeopleGroup[], void>({
      query: (personID) => `people/${personID}/`,
    }),
    getGearTypes: builder.query<GearType[], void>({
      query: () => "/gear-types/",
    }),
  }),
});

export const {
  useGetPersonQuery,
  useGetPersonListQuery,
  useGetGearItemQuery,
  useGetGearListQuery,
  useGetPurchasablesQuery,
  useGetAffiliationsQuery,
  useGetGroupsQuery,
  useGetGearTypesQuery,
} = gearDbApi;

export function useGearList({ q, page }: { q: string; page?: number }) {
  const { data } = useGetGearListQuery({ q: q?.trim(), page });
  const gearList = data?.results;
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;

  return { gearList, nbPages };
}

export function usePeopleList({
  q,
  page,
  openRentals,
}: {
  q: string;
  page?: number;
  openRentals?: boolean;
}) {
  const { data } = useGetPersonListQuery({ q: q?.trim(), page, openRentals });
  const personList = data?.results;
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;

  return { personList, nbPages };
}
