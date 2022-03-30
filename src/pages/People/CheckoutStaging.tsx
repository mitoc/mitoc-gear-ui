import { sum, map } from "lodash";
import Table from "react-bootstrap/Table";

import { GearSummary } from "apiClient/gear";
import { checkoutGear, Person } from "apiClient/people";
import { GearLink } from "components/GearLink";
import { fmtAmount } from "lib/fmtNumber";

type Props = {
  person: Person;
  gearToCheckout: GearSummary[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
};

export function CheckoutStaging({
  person,
  gearToCheckout,
  onRemove,
  onCheckout: onCheckoutCB,
}: Props) {
  const totalDeposit = sum(map(gearToCheckout, "depositAmount"));
  const totalDailyFee = sum(map(gearToCheckout, "dailyFee"));
  const gearIDs = map(gearToCheckout, "id");

  const onCheckout = () => {
    checkoutGear(person.id, gearIDs).then(onCheckoutCB);
  };

  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h3>Gear to check out</h3>
      {gearToCheckout && (
        <>
          <Table>
            <thead>
              <tr>
                <th></th>
                <th>Items</th>
                <th>Total deposit due</th>
                <th>Total daily fee</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>{gearToCheckout.length}</td>
                <td>{fmtAmount(totalDeposit)}</td>
                <td>{fmtAmount(totalDailyFee)}</td>
              </tr>
            </tbody>
          </Table>

          <Table>
            <thead>
              <tr>
                <th>Serial N.</th>
                <th>Type</th>
                <th>Deposit</th>
                <th>Daily fee</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {gearToCheckout.map(({ id, type, dailyFee, depositAmount }) => (
                <tr key={id}>
                  <td>
                    <GearLink id={id}>{id}</GearLink>
                  </td>
                  <td>{type.typeName}</td>
                  <td>{fmtAmount(depositAmount)}</td>
                  <td>{fmtAmount(dailyFee)}</td>
                  <td>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => onRemove(id)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      <div className="text-end">
        <button className="btn btn-primary btn-lg" onClick={onCheckout}>
          Check out
        </button>
      </div>
    </div>
  );
}
