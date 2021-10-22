import { request } from "./client";
import type { User } from "./types";

interface LoggedInResponse {
  loggedIn: boolean;
  user?: User;
}

export async function loggedIn(): Promise<LoggedInResponse> {
  return request("/auth/logged_in/", "GET");
}
