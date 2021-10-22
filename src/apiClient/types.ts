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
