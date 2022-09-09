import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import queryString from "query-string";

import { Person, PersonSummary, PeopleGroup } from "apiClient/people";
import type {
  GearItem,
  GearSummary,
  GearType,
  PurchasableItem,
} from "apiClient/gear";
import {
  Affiliations,
  ListWrapper,
  OfficeHour,
  PersonSignup,
  Signup,
} from "apiClient/types";
import { API_HOST } from "apiClient/client";
import { isEmpty } from "lodash";

export const gearDbApi = createApi({
  reducerPath: "gearDbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_HOST,
    credentials: "include",
    paramsSerializer: (params) =>
      queryString.stringify(params, { arrayFormat: "none" }),
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
        broken?: boolean;
        missing?: boolean;
        retired?: boolean;
        gearTypes?: number[];
      }
    >({
      query: ({ q, page, gearTypes, broken, missing, retired }) => ({
        url: "gear/",
        params: {
          ...(q && { q }),
          ...(page && { page }),
          ...(broken != null && { broken }),
          ...(missing != null && { missing }),
          ...(retired != null && { retired }),
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
      query: () => `/people-groups/`,
    }),
    getGearTypes: builder.query<GearType[], void>({
      query: () => "/gear-types/",
    }),
    getOfficeHours: builder.query<OfficeHour[], void>({
      query: () => "/office-hours/",
    }),
    getPersonSignups: builder.query<
      ListWrapper<PersonSignup>,
      {
        personID: string;
        approved?: boolean;
      }
    >({
      query: ({ personID, approved }) => ({
        url: `/people/${personID}/office-hour-signups/`,
        params: {
          ...(approved && { approved }),
        },
      }),
    }),
    getSignups: builder.query<
      ListWrapper<Signup>,
      {
        approved?: boolean;
        creditRequested?: boolean;
      }
    >({
      query: ({ approved, creditRequested }) => ({
        url: `/office-hour-signups/`,
        params: {
          ...(approved != null && { approved }),

          ...(creditRequested != null && { creditRequested }),
        },
      }),
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
  useGetOfficeHoursQuery,
  useGetPersonSignupsQuery,
  useGetSignupsQuery,
} = gearDbApi;

export function useGearList({
  q,
  page,
  gearTypes,
  broken,
  missing,
  retired,
}: {
  q: string;
  page?: number;
  gearTypes?: number[];
  broken?: boolean;
  missing?: boolean;
  retired?: boolean;
}) {
  const { data } = useGetGearListQuery({
    q: q?.trim(),
    page,
    gearTypes,
    broken,
    missing,
    retired,
  });
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
