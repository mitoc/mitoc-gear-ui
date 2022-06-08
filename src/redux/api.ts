import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Person, PersonSummary, PeopleGroup } from "apiClient/people";
import type {
  GearItem,
  GearSummary,
  GearType,
  PurchasableItem,
} from "apiClient/gear";
import { Affiliations, ListWrapper } from "apiClient/types";
import { API_HOST } from "apiClient/client";
import { isEmpty } from "lodash";

export const gearDbApi = createApi({
  reducerPath: "gearDbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_HOST,
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
        groups?: number[];
      }
    >({
      query: ({ q, page, openRentals, groups }) => ({
        url: "people/",
        params: {
          ...(q && { q }),
          ...(page && { page }),
          ...(openRentals && { openRentals }),
          ...(!isEmpty(groups) && { groups }),
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
        gearTypes?: number[];
      }
    >({
      query: ({ q, page, includeRetired, gearTypes }) => ({
        url: "gear/",
        params: {
          ...(q && { q }),
          ...(page && { page }),
          ...(!includeRetired && { retired: false }),
          ...(!isEmpty(gearTypes) && { gearTypes }),
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
      query: (personID) => `/people-groups/`,
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

export function useGearList({
  q,
  page,
  gearTypes,
}: {
  q: string;
  page?: number;
  gearTypes?: number[];
}) {
  const { data } = useGetGearListQuery({ q: q?.trim(), page, gearTypes });
  const gearList = data?.results;
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;

  return { gearList, nbPages };
}

export function usePeopleList({
  q,
  page,
  openRentals,
  groups,
}: {
  q: string;
  page?: number;
  openRentals?: boolean;
  groups?: number[];
}) {
  const { data } = useGetPersonListQuery({
    q: q?.trim(),
    page,
    openRentals,
    groups,
  });
  const personList = data?.results;
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;

  return { personList, nbPages };
}
