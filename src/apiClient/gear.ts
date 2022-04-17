import { request } from "./client";
import { PersonSummary } from "./people";
import { ListWrapper, Note } from "./types";

export interface GearSummary {
  id: string;
  available: boolean;
  broken: string;
  // TODO: This is weird, we shouldn't have the rentals in there
  checkedOutTo: PersonSummary | null;
  dailyFee: number;
  depositAmount: number;
  description?: string;
  missing: string;
  restricted: boolean;
  retired: string;
  size?: string;
  specification?: string;
  type: {
    typeName: string;
  };
}

export interface GearItem extends GearSummary {
  notes: Note[];
}

export interface GearRental {
  person: {
    id: string;
    firstName: string;
    lastName: string;
  };
  checkedout: string;
  returned: string;
  weeksOut: number;
}

export interface PurchasableItem {
  id: string;
  price: number;
  name: string;
}

export interface GearType {
  id: string;
  typeName: string;
  shorthand: string;
}

async function getGearRentalHistory(
  id: string,
  page?: number
): Promise<ListWrapper<GearRental>> {
  return request(`/gear/${id}/rentals/`, "GET", { ...(page && { page }) });
}

async function addNote(id: string, note: string) {
  return request(`/gear/${id}/note/`, "POST", {
    note,
  });
}

async function markRetired(id: string, note?: string) {
  return request(`/gear/${id}/retired/`, "POST", {
    note,
  });
}
async function markBroken(id: string, note: string) {
  return request(`/gear/${id}/broken/`, "POST", {
    note,
  });
}
async function markMissing(id: string, note?: string) {
  return request(`/gear/${id}/missing/`, "POST", {
    note,
  });
}
async function markUnretired(id: string, note?: string) {
  return request(`/gear/${id}/retired/`, "DELETE", {
    note,
  });
}
async function markFixed(id: string, note?: string) {
  return request(`/gear/${id}/broken/`, "DELETE", {
    note,
  });
}
async function markFound(id: string, note?: string) {
  return request(`/gear/${id}/missing/`, "DELETE", {
    note,
  });
}

export type CreateGearArgs = {
  type: string;
  idSuffix?: string;
  quantity: number;
  size?: string;
  specification?: string;
  deposit_amount?: number;
  description?: string;
};

async function createGear(
  args: CreateGearArgs
): Promise<{ items: GearSummary[] }> {
  return request(`/gear/`, "POST", args);
}

export {
  addNote,
  createGear,
  getGearRentalHistory,
  markBroken,
  markFixed,
  markFound,
  markMissing,
  markRetired,
  markUnretired,
};
