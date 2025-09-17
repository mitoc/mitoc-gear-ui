import { GearSummary } from "src/apiClient/gear";

export function RestrictedGearWarning({ gear }: { gear: GearSummary[] }) {
  return (
    <div className="alert alert-warning p-2">
      <h4 className="text-center">
        <strong>Unapproved restricted gear</strong>
      </h4>
      Some items are <strong>restricted</strong>, and are not marked as approved
      in the database.
      <br />
      Please make sure renter has received approval (e.g. over email), or is a
      leader running a MITOC trip.
      <br />
      <br />
      Items:
      <ul>
        {gear.map(({ type, id }) => (
          <li key={id}>
            {id} ({type.typeName})
          </li>
        ))}
      </ul>
    </div>
  );
}
