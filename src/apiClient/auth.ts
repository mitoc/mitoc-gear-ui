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
  return request("/auth/logged-in/", "GET");
}

async function logIn(query: LogInQuery): Promise<User | APIErrorType> {
  return request("/auth/login/", "POST", query);
}

async function checkResetPasswordToken(query: {
  email: string;
  token: string;
}): Promise<{}> {
  return request("/auth/reset-password/check-token/", "GET", query);
}

async function requestResetPassword(query: { email: string }): Promise<{}> {
  return request("/auth/reset-password/request/", "POST", query);
}

async function confirmResetPassword(query: {
  email: string;
  password: string;
  token: string;
}): Promise<{}> {
  return request("/auth/reset-password/confirm/", "POST", query);
}

async function logOut(): Promise<void> {
  return request("/auth/logout/", "POST");
}

export const authClient = {
  checkResetPasswordToken,
  confirmResetPassword,
  requestResetPassword,
  loggedIn,
  logIn,
  logOut,
};
