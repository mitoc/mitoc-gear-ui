import { request } from "./client";

export async function signUp(officeHourId: string) {
  return request(`/office-hours/${officeHourId}/signup/`, "POST");
}

// TODO: Change this endpoint
export async function cancelSignUp(officeHourId: string, signupId: string) {
  return request(`/office-hours/${officeHourId}/signup/${signupId}/`, "DELETE");
}

export async function requestCredit(
  signupId: number,
  duration: string,
  note?: string
) {
  return request(`/office-hour-signups/${signupId}/request-credit/`, "POST", {
    duration,
    note,
  });
}
