import { addNote } from "apiClient/gear";
import { Notes } from "components/Notes";
import { useSetPageTitle } from "hooks";
import { useParams } from "react-router-dom";
import { useGetGearItemQuery } from "redux/api";

import { GearInfoPanel } from "./GearInfoPanel";
import { GearRentalsHistory } from "./GearRentalsHistory";
import { GearPicture } from "./GearPicture";

export function GearItemPage() {
  const { gearId } = useParams<{ gearId: string }>();
  useSetPageTitle(gearId);
  const { data: gearItem, refetch: refreshGear } = useGetGearItemQuery(gearId);

  if (gearItem == null) {
    return null;
  }
  return (
    <div className="row">
      <div className="col-12 col-md-5 p-2">
        <GearInfoPanel gearItem={gearItem} refreshGear={refreshGear} />
        <GearPicture gearItem={gearItem} refreshGear={refreshGear} />
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
