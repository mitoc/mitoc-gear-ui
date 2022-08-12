import { request } from "./client";

export async function signUp(officeHourId: string) {
  return request(`/office-hours/${officeHourId}/signup/`, "POST");
}
