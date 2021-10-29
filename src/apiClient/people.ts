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

async function getPersonList(): Promise<ListWrapper<PersonSummary>> {
  return request("/people", "GET");
}

export const peopleClient = {
  getPersonList,
};
