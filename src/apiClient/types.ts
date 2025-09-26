import { SignupID } from "./idTypes";
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
  id: number;
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
    id: SignupID;
    deskWorker: PersonWithOfficeAccess;
  }[];
}

export interface PersonSignup {
  id: SignupID;
  creditRequested?: string;
  approved?: string;
  duration?: string;
  date: string;
  note?: string;
  eventType: string;
  credit?: number;
}

export interface Signup extends PersonSignup {
  deskWorker: PersonWithOfficeAccess;
}
