import { GearLink } from "components/GearLink";
import { formatDate } from "lib/fmtDate";
import { fmtAmount } from "lib/fmtNumber";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";

export function PersonRentals() {
  const { person, returnBasket } = usePersonPageContext();
  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3>Gear out</h3>
      <table className="table">
        <tbody>
          {person.rentals
            .filter((item) => !returnBasket.items.some((r) => r.id === item.id))
            .map((rental) => {
              const { id, type, checkedout, weeksOut, totalAmount } = rental;

              return (
                <tr key={id}>
                  <td className="d-md-none">
                    <GearLink id={id}>{id}</GearLink> - {type.typeName}
                    <br />
                    <span>Fee: {fmtAmount(type.rentalAmount)} / day</span>
                    <br />
                    Checked out on {formatDate(checkedout)}
                    <br />
                    <span>Weekends out: {weeksOut}</span>
                    <br />
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => returnBasket.add(rental)}
                      >
                        Return
                      </button>
                    </div>
                  </td>
                  <td className="d-none d-md-table-cell align-middle">
                    <button
                      className="w-100 h-100 btn btn-outline-primary"
                      onClick={() => returnBasket.add(rental)}
                    >
                      Return
                    </button>
                  </td>
                  <td className="d-none d-md-table-cell ">
                    <GearLink id={id}>{id}</GearLink>
                    <br />
                    <span>{type.typeName}</span>
                    <br />
                    <span>Daily fee: {fmtAmount(type.rentalAmount)}</span>
                  </td>
                  <td className="d-none d-md-table-cell ">
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
      </table>
    </div>
  );
}
