import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import type { Person, Rental } from "apiClient/people";
import { formatDate } from "lib/fmtDate";

type Props = {
  rentals: Person["rentals"];
  rentalsToReturn: Rental[];
  onReturn: (rental: Rental) => void;
};

export function PersonRentals({ rentals, onReturn, rentalsToReturn }: Props) {
  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3>Gear out</h3>
      <Table>
        <tbody>
          {rentals
            .filter((item) => !rentalsToReturn.some((r) => r.id === item.id))
            .map((rental) => {
              const { id, type, checkedout, weeksOut, totalAmount } = rental;

              return (
                <tr key={id}>
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
                    <span>Weekends out: {weeksOut}</span>
                    <br />
                    <span>Total amount: {totalAmount}</span>
                  </td>
                  <td className="align-middle">
                    <Button
                      className="w-100 h-100 btn-lg"
                      variant="outline-primary"
                      onClick={() => onReturn(rental)}
                    >
                      Return
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
}
