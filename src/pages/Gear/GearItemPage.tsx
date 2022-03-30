import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch } from "app/hooks";
import { getGearItem, GearItem, addNote } from "apiClient/gear";
import { Notes } from "components/Notes";
import { useGearItem, fetchGear } from "features/cache";

import { GearInfoPanel } from "./GearInfoPanel";
import { GearRentalsHistory } from "./GearRentalsHistory";

export function GearItemPage() {
  const dispatch = useAppDispatch();
  const { gearId } = useParams<{ gearId: string }>();
  const gearItem = useGearItem(gearId);
  const refreshGear = () => dispatch(fetchGear(gearId));

  if (gearItem == null) {
    return null;
  }
  return (
    <div className="row">
      <div className="col-12 col-md-5 p-2">
        <GearInfoPanel gearItem={gearItem} refreshGear={refreshGear} />
        <Notes
          notes={gearItem.notes}
          onAdd={(note) => addNote(gearId, note).then(refreshGear)}
        />
      </div>
      <div className="col-12 col-md-7 p-2">
        <GearRentalsHistory gearId={gearId} />
      </div>
    </div>
  );
}
