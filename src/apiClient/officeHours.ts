import { request } from "./client";

export async function signUp(officeHourId: string) {
  return request(`/office-hours/${officeHourId}/signup/`, "POST");
}

export async function cancelSignUp(officeHourId: string, signupId: string) {
  return request(`/office-hours/${officeHourId}/signup/${signupId}/`, "DELETE");
}
