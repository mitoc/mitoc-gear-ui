import { APIErrorType } from "apiClient/types";

export function AddNewGearError({ err }: { err: APIErrorType }) {
  if (err.err !== "gearIdAlreadyExists") {
    return <div className="alert alert-danger">{err.msg}</div>;
  }
  const gearItems = err.args!.gearItems as string[];
  return (
    <div className="alert alert-danger">
      Gear creation failed.
      <br />
      {err.msg}:
      <ul className="list-group alert-danger list-group-flush">
        {gearItems.map((itemID) => {
          return (
            <li className="list-group-item list-group-item-danger" key={itemID}>
              {itemID}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
