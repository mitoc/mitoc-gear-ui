import { API_HOST } from "src/apiClient/client";
import { editGearType, GearType } from "src/apiClient/gear";
import { useSetPageTitle } from "src/hooks";
import { useGetGearTypesQuery } from "src/redux/api";

export default function GearInventoryPage() {
  useSetPageTitle("Gear Inventory");
  const { data: allGearTypes, refetch } = useGetGearTypesQuery();
  return (
    <div className="row">
      <h1>Gear inventory</h1>
      <h2>Gear types to inventory</h2>
      <div className="row mb-4">
        {allGearTypes?.map((gearType) => {
          return (
            <div
              key={gearType.id}
              className="col-4"
              style={{ border: "grey dotted 1px" }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={gearType.shouldInventory}
                  onChange={() => {
                    editGearType(gearType.id, {
                      shouldInventory: !gearType.shouldInventory,
                    }).then(refetch);
                  }}
                />{" "}
                {gearType.typeName}
              </label>
            </div>
          );
        })}
      </div>
      <h2>Export CSV files</h2>
      <a
        className="btn btn-primary col-3 me-3"
        href={API_HOST + "/gear-inventory/export"}
      >
        Export gear CSV
      </a>
      <button
        className="btn btn-primary col-3"
        onClick={() => {
          if (allGearTypes == null) {
            return;
          }
          const csvContent = makeGearTypesCSV(
            allGearTypes.filter((gearType) => gearType.shouldInventory),
          );
          downloadCSVFile(csvContent, "gear-types.csv");
        }}
      >
        Export gear types CSV
      </button>
    </div>
  );
}

function makeGearTypesCSV(types: GearType[]) {
  return [
    ["ID", "Type Name"],
    ...types.map((gearType) => [gearType.id, gearType.typeName].join(",")),
  ].join("\n");
}

function downloadCSVFile(content: string, name: string) {
  const blob = new Blob([content], { type: "text/csv" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );
  document.body.removeChild(link);
}
