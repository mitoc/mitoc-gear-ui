import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { isEmpty } from "lodash";
import queryString from "query-string";

import { Approval, RenterApproval } from "src/apiClient/approvals";
import { API_HOST } from "src/apiClient/client";
import { Config } from "src/apiClient/config";
import type {
  GearItem,
  GearLocation,
  GearSummary,
  GearType,
  PurchasableItem,
} from "src/apiClient/gear";
import { getPagesCount } from "src/apiClient/getPagesCount";
import { PeopleGroup, Person, PersonSummary } from "src/apiClient/people";
import {
  Affiliations,
  ListWrapper,
  OfficeHour,
  PersonSignup,
  Signup,
} from "src/apiClient/types";

export const gearDbApi = createApi({
  reducerPath: "gearDbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_HOST,
    credentials: "include",
    paramsSerializer: (params) =>
      queryString.stringify(params, { arrayFormat: "none" }),
  }),
  tagTypes: ["Approvals"],
  endpoints: (builder) => ({
    getConfig: builder.query<Config, void>({
      query: () => `config/`,
      // Keep config in cache
      keepUnusedDataFor: 24 * 60 * 60,
    }),
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
        locations?: number[];
      }
    >({
      query: ({ q, page, gearTypes, broken, missing, retired, locations }) => ({
        url: "gear/",
        params: {
          ...(q && { q }),
          ...(page && { page }),
          ...(broken != null && { broken }),
          ...(missing != null && { missing }),
          ...(retired != null && { retired }),
          ...(!isEmpty(gearTypes) && { gearTypes }),
          ...(!isEmpty(locations) && { locations }),
        },
      }),
    }),
    getGearTypePictures: builder.query<string[], string | number>({
      query: (gearType) => `/gear-types/${gearType}/pictures`,
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
        page?: number;
        orderBy?: "date" | "-date";
      }
    >({
      query: ({ personID, approved, page, orderBy }) => ({
        url: `/people/${personID}/office-hour-signups/`,
        params: {
          ...(approved && { approved }),
          ...(page != null && { page }),
          ...(orderBy != null && { orderBy }),
        },
      }),
    }),
    getSignups: builder.query<
      ListWrapper<Signup>,
      {
        approved?: boolean;
        creditRequested?: boolean;
        page?: number;
        before?: string;
        after?: string;
        orderBy?: "date" | "-date";
      }
    >({
      query: ({ approved, creditRequested, page, before, after, orderBy }) => ({
        url: `/office-hour-signups/`,
        params: {
          ...(approved != null && { approved }),
          ...(creditRequested != null && { creditRequested }),
          ...(page != null && { page }),
          ...(before != null && { before }),
          ...(after != null && { after }),
          ...(orderBy != null && { orderBy }),
        },
      }),
    }),
    getApprovals: builder.query<ListWrapper<Approval>, { past?: boolean }>({
      query: ({ past }) => ({
        url: "/approvals/",
        params: {
          past,
        },
      }),
      providesTags: ["Approvals"],
    }),
    getRenterApprovals: builder.query<
      ListWrapper<RenterApproval>,
      { personID: string; past: boolean; future?: boolean }
    >({
      query: ({ personID, past }) => ({
        url: `people/${personID}/approvals`,
        params: {
          past,
        },
      }),
      providesTags: ["Approvals"],
    }),
    getGearLocations: builder.query<GearLocation[], void>({
      query: () => "/gear-locations/",
    }),
  }),
});

export const {
  useGetConfigQuery,
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
  useGetApprovalsQuery,
  useGetGearLocationsQuery,
  useGetGearTypePicturesQuery,
  useGetRenterApprovalsQuery,
} = gearDbApi;

export function useGearList({
  q,
  page,
  gearTypes,
  broken,
  missing,
  retired,
  locations,
}: {
  q: string;
  page?: number;
  gearTypes?: number[];
  broken?: boolean;
  missing?: boolean;
  retired?: boolean;
  locations?: number[];
}) {
  const result = useGetGearListQuery({
    q: q?.trim(),
    page,
    gearTypes,
    broken,
    missing,
    retired,
    locations,
  });
  const data = result.data;
  const gearList = data?.results;
  const nbPages = data ? getPagesCount(data) : undefined;

  return { gearList, nbPages, ...result };
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
  const result = useGetPersonListQuery({
    q: q?.trim(),
    page,
    openRentals,
    groups,
  });
  const data = result.data;
  const personList = data?.results;
  const nbPages = data ? getPagesCount(data) : undefined;

  return { personList, nbPages, ...result };
}
