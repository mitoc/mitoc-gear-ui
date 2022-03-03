import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

import type { GearRental } from "apiClient/gear";
import { formatDate } from "lib/fmtDate";

type Props = {
  rentals: GearRental[] | null;
};

export function GearRentalsHistory({ rentals }: Props) {
  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3>Rental History</h3>
      {rentals && (
        <Table>
          <thead>
            <th>Renter</th>
            <th>Checked out</th>
            <th>Returned</th>
            <th>Weeks out</th>
          </thead>
          <tbody>
            {rentals.map(({ person, checkedout, returned, weeksOut }) => (
              <tr>
                <td>
                  <Link to={`/person/${person.id}`}>
                    {person.firstName} {person.lastName}
                  </Link>
                </td>
                <td>{formatDate(checkedout)}</td>
                <td>{returned && formatDate(returned)}</td>
                <td>{weeksOut}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
