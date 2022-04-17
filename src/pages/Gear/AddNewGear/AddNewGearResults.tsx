import { Link } from "react-router-dom";

import { GearLink } from "components/GearLink";
import { GearSummary } from "apiClient/gear";

export function AddNewGearResults({
  gearCreated,
  onReset,
}: {
  gearCreated: GearSummary[];
  onReset: () => void;
}) {
  return (
    <>
      <p className="mb-2 alert alert-success">
        Success! The following items were created:
      </p>
      <ul className="list-group mb-3">
        {gearCreated.map((item) => {
          return (
            <li key={item.id} className="list-group-item">
              <GearLink id={item.id}>{item.id}</GearLink>
            </li>
          );
        })}
      </ul>
      <div className="d-flex justify-content-between">
        <Link to="/gear">
          <button type="button" className="btn btn-outline-secondary">
            Back to gear list
          </button>
        </Link>
        <button type="button" className="btn btn-primary" onClick={onReset}>
          Add more gear
        </button>
      </div>
    </>
  );
}
