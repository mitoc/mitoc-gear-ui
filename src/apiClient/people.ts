import * as dayjs from "dayjs";

import { request } from "./client";
import { ListWrapper, Note } from "./types";

export interface PersonSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  rentals: Rental[];
}

export interface Expireable {
  expires: string;
}

export interface Person extends PersonSummary {
  affiliation: string;
  membership?: Expireable & { membershipType: string };
  waiver?: Expireable;
  frequentFlyerCheck?: Expireable;
  groups: { groupName: string; id: string }[];
  notes: Note[];
  mitocCredit: number;
}

export interface Rental {
  id: string;
  checkedout: string;
  returned?: string;
  totalAmount: number;
  weeksOut: number;
  type: {
    typeName: string;
    rentalAmount: number;
  };
}

export interface GearToReturn {
  id: string;
  daysCharged?: number;
}

export interface Affiliation {
  id: string;
  name: string;
  dues: number;
}

async function getPersonList(
  q?: String,
  page?: number
): Promise<ListWrapper<PersonSummary>> {
  return request("/people/", "GET", {
    ...(q && { q }),
    ...(page && { page }),
  });
}

async function getPerson(id: string): Promise<Person> {
  return request(`/people/${id}/`, "GET");
}

async function addFFChecks(id: string, date: Date, checkNumber: string) {
  return request(`/people/${id}/frequent_flyer_check/`, "POST", {
    expires: dayjs(date).format("YYYY-MM-DD"),
    ...(checkNumber && { checkNumber }),
  });
}

async function addWaiver(id: string, date: Date) {
  return request(`/people/${id}/waiver/`, "POST", {
    expires: dayjs(date).format("YYYY-MM-DD"),
  });
}

async function addMembership(id: string, date: Date, membershipType: string) {
  return request(`/people/${id}/membership/`, "POST", {
    expires: dayjs(date).format("YYYY-MM-DD"),
    membershipType,
  });
}

async function getPersonRentalHistory(
  id: string,
  page?: number
): Promise<ListWrapper<Rental>> {
  return request(`/people/${id}/rentals/`, "GET", { ...(page && { page }) });
}

async function checkoutGear(personID: number, gearIDs: string[]) {
  return request(`/people/${personID}/rentals/`, "POST", { gearIds: gearIDs });
}

async function returnGear(
  personID: number,
  gear: GearToReturn[],
  purchases: string[] = [],
  checkNumber: string = "",
  useMitocCredit?: number
) {
  return request(`/people/${personID}/return/`, "POST", {
    gear,
    checkNumber,
    purchases,
    useMitocCredit,
  });
}

async function getAffiliations() {
  return request(`/affiliations/`, "GET");
}

export {
  addFFChecks,
  addMembership,
  addWaiver,
  checkoutGear,
  getAffiliations,
  getPerson,
  getPersonList,
  getPersonRentalHistory,
  returnGear,
};
