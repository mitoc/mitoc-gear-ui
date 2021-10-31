import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import type { Person } from "apiClient/people";
import { formatDate } from "lib/fmtDate";

type Props = {
  rentals: Person["rentals"];
};

export function PersonRentals({ rentals }: Props) {
  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3>Gear out</h3>
      <Table>
        <tbody>
          {rentals.map(({ id, type, checkedout }) => (
            <tr>
              <td>
                <Link to={`/gear/${id}`}>{id}</Link>
                <br />
                <span>{type.typeName}</span>
                <br />
                <span>Daily fee: ${type.rentalAmount}</span>
              </td>
              <td>
                Checked out on {formatDate(checkedout)}
                <br />
                <span>Weekends out: 85</span>
                <br />
                <span>Total amount: $45</span>
              </td>
              <td className="align-middle">
                <Button
                  className="w-100 h-100 btn-lg"
                  variant="outline-primary"
                >
                  Return
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
