import { request } from "./client";

export async function signUp(officeHourId: string) {
  return request(`/office-hours/${officeHourId}/signup/`, "POST");
}

export async function cancelSignUp(signupId: string) {
  return request(`/office-hour-signups/${signupId}/`, "DELETE");
}

export async function requestCredit(
  signupId: number,
  duration: string,
  note?: string
) {
  const formattedDuration = duration + ":00";
  return request(`/office-hour-signups/${signupId}/request-credit/`, "POST", {
    duration: formattedDuration,
    note,
  });
}
