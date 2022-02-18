import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getGearItem, GearSummary } from "apiClient/gear";

import { GearInfoPanel } from "./GearInfoPanel";

export function GearItemPage() {
  const { gearId } = useParams<{ gearId: string }>();
  const [gearItem, setGearItem] = useState<GearSummary | null>(null);
  useEffect(() => {
    getGearItem(gearId).then((person) => setGearItem(person));
  }, [gearId]);
  if (gearItem == null) {
    return null;
  }
  return (
    <div className="row">
      <div className="col-5 p-2">
        <GearInfoPanel gearItem={gearItem} />
        {/* <PersonProfile person={person} /> */}
        {/* <Notes notes={person.notes} /> */}
      </div>
      <div className="col-7 p-2">
        {/* <PersonRentals rentals={person.rentals} /> */}
      </div>
    </div>
  );
}
