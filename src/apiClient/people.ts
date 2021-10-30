import { request } from "./client";

export interface ListWrapper<T> {
  count: number;
  previous: string | null;
  next: string | null;
  results: T[];
}

export interface PersonSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

async function getPersonList(
  q?: String,
  page?: number
): Promise<ListWrapper<PersonSummary>> {
  console.log({ q });
  return request("/people/", "GET", {
    ...(q && { q }),
    ...(page && { page }),
  });
}

export const peopleClient = {
  getPersonList,
};
