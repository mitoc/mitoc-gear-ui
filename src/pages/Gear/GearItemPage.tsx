import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getGearItem, GearItem } from "apiClient/gear";
import { Notes } from "components/Notes";

import { GearInfoPanel } from "./GearInfoPanel";
import { GearRentalsHistory } from "./GearRentalsHistory";

export function GearItemPage() {
  const { gearId } = useParams<{ gearId: string }>();
  const [gearItem, setGearItem] = useState<GearItem | null>(null);

  useEffect(() => {
    getGearItem(gearId).then((item) => setGearItem(item));
  }, [gearId]);
  if (gearItem == null) {
    return null;
  }
  return (
    <div className="row">
      <div className="col-5 p-2">
        <GearInfoPanel gearItem={gearItem} />
        <Notes notes={gearItem.notes} />
      </div>
      <div className="col-7 p-2">
        <GearRentalsHistory gearId={gearId} />
      </div>
    </div>
  );
}
