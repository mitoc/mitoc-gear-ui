import { PeopleGroup, PersonBase, PersonWithOfficeAccess } from "./people";

export interface ListWrapper<T> {
  count: number;
  pageSize: number;
  previous: string | null;
  next: string | null;
  results: T[];
}

export interface User extends PersonBase {
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
  author: PersonBase;
}

export interface Affiliations {
  id: string;
  name: string;
  dues: number;
}

export interface OfficeHour {
  googleId: string;
  title: string;
  startTime: string;
  endTime: string;
  signups: {
    id: string;
    deskWorker: PersonWithOfficeAccess;
  }[];
}

export interface PersonSignup {
  creditRequested?: string;
  approved?: string;
  duration?: string;
  date: string;
  id: number;
  note?: string;
  eventType: string;
  credit?: number;
}

export interface Signup extends PersonSignup {
  deskWorker: { id: string; firstName: string; lastName: string };
}
