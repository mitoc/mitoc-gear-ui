import { useParams } from "react-router-dom";

import { addNote } from "src/apiClient/gear";
import { Notes } from "src/components/Notes";
import { useSetPageTitle } from "src/hooks";
import { useGetGearItemQuery } from "src/redux/api";
import { invalidateCache } from "src/redux/store";

import { GearInfoPanel } from "./GearInfoPanel";
import { GearPicture } from "./GearPicture";
import { GearRentalsHistory } from "./GearRentalsHistory";

export default function GearItemPage() {
  const gearId = useParams<{ gearId: string }>().gearId!;
  useSetPageTitle(gearId);
  const { data: gearItem } = useGetGearItemQuery(gearId);

  if (gearItem == null) {
    return null;
  }
  return (
    <div className="row">
      <div className="col-12 col-md-5 p-2">
        <GearInfoPanel gearItem={gearItem} />
        <GearPicture gearItem={gearItem} />
        <Notes
          notes={gearItem.notes}
          onAdd={(note) =>
            addNote(gearId, note).then(() => invalidateCache(["GearItems"]))
          }
        />
      </div>
      <div className="col-12 col-md-7 p-2">
        <GearRentalsHistory gearId={gearId} />
      </div>
    </div>
  );
}
