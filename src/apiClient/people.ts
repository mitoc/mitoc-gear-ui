import { request } from "./client";
import { ListWrapper, Note } from "./types";

export interface PersonSummary {
  id: number;
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
  membership?: Expireable;
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
  return request(`/people/${id}`, "GET");
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

export {
  checkoutGear,
  getPerson,
  getPersonList,
  getPersonRentalHistory,
  returnGear,
};
