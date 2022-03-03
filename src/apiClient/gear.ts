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
    id: number;
    firstName: string;
    lastName: string;
  };
  checkedout: string;
  returned: string;
  weeksOut: number;
}

async function getGearList(
  q?: String,
  page?: number,
  includeRetired?: boolean
): Promise<ListWrapper<GearSummary>> {
  return request("/gear/", "GET", {
    ...(q && { q }),
    ...(page && { page }),
    ...(!includeRetired && { retired: false }),
  });
}

async function getGearItem(id: string): Promise<GearItem> {
  return request(`/gear/${id}`, "GET");
}

async function getGearRentalHistory(
  id: string,
  page?: number
): Promise<ListWrapper<GearRental>> {
  return request(`/gear/${id}/rentals/`, "GET", { ...(page && { page }) });
}

export { getGearList, getGearItem, getGearRentalHistory };
