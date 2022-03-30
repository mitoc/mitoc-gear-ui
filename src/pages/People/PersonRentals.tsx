import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import type { Person, Rental } from "apiClient/people";
import { formatDate } from "lib/fmtDate";
import { GearLink } from "components/GearLink";
import { fmtAmount } from "lib/fmtNumber";

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
                  <td className="align-middle">
                    <Button
                      className="w-100 h-100 btn"
                      variant="outline-primary"
                      onClick={() => onReturn(rental)}
                    >
                      Return
                    </Button>
                  </td>
                  <td>
                    <GearLink id={id}>{id}</GearLink>
                    <br />
                    <span>{type.typeName}</span>
                    <br />
                    <span>Daily fee: {fmtAmount(type.rentalAmount)}</span>
                  </td>
                  <td>
                    Checked out on {formatDate(checkedout)}
                    <br />
                    <span>Weekends out: {weeksOut}</span>
                    <br />
                    <span>Total amount: {fmtAmount(totalAmount)}</span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
}
