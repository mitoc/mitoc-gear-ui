import { request } from "./client";
import { PersonSummary } from "./people";
import { ListWrapper, Note } from "./types";

export interface GearSummary {
  id: string;
  available: boolean;
  broken: string;
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

async function getGearList({
  q,
  page,
  includeRetired,
}: {
  q?: string;
  page?: number;
  includeRetired?: boolean;
}): Promise<ListWrapper<GearSummary>> {
  return request("/gear/", "GET", {
    ...(q && { q }),
    ...(page && { page }),
    ...(!includeRetired && { retired: false }),
  });
}

async function getGearItem(id: string): Promise<GearItem> {
  return request(`/gear/${id}/`, "GET");
}

async function getGearRentalHistory(
  id: string,
  page?: number
): Promise<ListWrapper<GearRental>> {
  return request(`/gear/${id}/rentals/`, "GET", { ...(page && { page }) });
}

async function getPurchasableList(): Promise<PurchasableItem[]> {
  return request(`/purchasable/`, "GET");
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

export {
  addNote,
  getGearItem,
  getGearList,
  getGearRentalHistory,
  getPurchasableList,
  markBroken,
  markFixed,
  markFound,
  markMissing,
  markRetired,
  markUnretired,
};
