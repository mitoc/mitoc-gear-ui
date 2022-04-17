import { request } from "./client";
import type { APIErrorType, User } from "./types";

interface LoggedInResponse {
  loggedIn: boolean;
  user?: User;
}

export interface LogInQuery {
  username: string;
  password: string;
}

async function loggedIn(): Promise<LoggedInResponse> {
  return request("/auth/logged_in/", "GET");
}

async function logIn(query: LogInQuery): Promise<User | APIErrorType> {
  return request("/auth/login/", "POST", query);
}

async function logOut(): Promise<void> {
  return request("/auth/logout/", "POST");
}

export const authClient = {
  loggedIn,
  logIn,
  logOut,
};
