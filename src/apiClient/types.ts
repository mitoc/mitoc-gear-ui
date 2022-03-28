export interface ListWrapper<T> {
  count: number;
  previous: string | null;
  next: string | null;
  results: T[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isDeskworker: boolean;
}

export interface ApiError {
  msg: string;
  err: string;
}

export interface Note {
  id: string;
  note: string;
  dateInserted: string;
  author: { firstName: string; lastName: string };
}
