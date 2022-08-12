import { PeopleGroup } from "./people";

export interface ListWrapper<T> {
  count: number;
  previous: string | null;
  next: string | null;
  results: T[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isDeskworker: boolean;
  groups: PeopleGroup[];
}

export interface APIErrorType {
  msg: string;
  err: string;
  args?: Record<string, any>;
}

export interface Note {
  id: string;
  note: string;
  dateInserted: string;
  author: { firstName: string; lastName: string };
}

export interface Affiliations {
  id: string;
  name: string;
  dues: number;
}

export interface OfficeHour {
  google_id: string;
  title: string;
  startTime: string;
  endTime: string;
  signups: {
    id: number;
    deskWorker: { id: number; firstName: string; lastName: string };
  }[];
}
