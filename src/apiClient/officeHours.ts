import { request } from "./client";

export async function signUp(officeHourId: string) {
  return request(`/office-hours/${officeHourId}/signup/`, "POST");
}

export async function cancelSignUp(signupId: number) {
  return request(`/office-hour-signups/${signupId}/`, "DELETE");
}

export async function requestOfficeHourCredit(
  signupId: number,
  duration: string,
  note?: string,
) {
  const formattedDuration = duration + ":00";
  return request(`/office-hour-signups/${signupId}/request-credit/`, "POST", {
    duration: formattedDuration,
    note,
  });
}

export async function requestOtherEventCredit(
  eventType: string,
  date: string,
  duration: string,
  note?: string,
) {
  const formattedDuration = duration + ":00";
  return request(`/office-hour-signups/`, "POST", {
    eventType,
    date,
    duration: formattedDuration,
    note,
  });
}
export async function approveCredit(
  signupId: number,
  duration: string,
  credit: number,
) {
  const formattedDuration = duration + ":00";
  return request(`/office-hour-signups/${signupId}/approve/`, "POST", {
    duration: formattedDuration,
    credit,
  });
}
