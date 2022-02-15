import { request } from "./client";
import { PersonSummary } from "./people";
import { ListWrapper } from "./types";

export interface GearSummary {
  id: string;
  available: boolean;
  broken: string;
  checkedOutTo: PersonSummary | null;
  dailyFee: number;
  depositAmount: number;
  description: string;
  missing: string;
  restricted: boolean;
  retired: string;
  size: string;
  specification: string;
}

async function getGearList(
  q?: String,
  page?: number
): Promise<ListWrapper<GearSummary>> {
  return request("/gear/", "GET", {
    ...(q && { q }),
    ...(page && { page }),
  });
}

async function getGearItem(id: string): Promise<GearSummary> {
  return request(`/gear/${id}`, "GET");
}

export { getGearList, getGearItem };
