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

export interface Person extends PersonSummary {}

async function getPersonList(
  q?: String,
  page?: number
): Promise<ListWrapper<PersonSummary>> {
  return request("/people/", "GET", {
    ...(q && { q }),
    ...(page && { page }),
  });
}

async function getPerson(id: string): Promise<Person> {
  return request(`/people/${id}`, "GET");
}

export const peopleClient = {
  getPersonList,
  getPerson,
};
