import { sum, map } from "lodash";
import Table from "react-bootstrap/Table";

import { GearSummary } from "apiClient/gear";
import { checkoutGear, Person } from "apiClient/people";
import { GearLink } from "components/GearLink";
import { fmtAmount } from "lib/fmtNumber";
import { RemoveButton } from "components/Buttons";

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
  const gearIDs = map(gearToCheckout, "id");

  const onCheckout = () => {
    checkoutGear(person.id, gearIDs).then(onCheckoutCB);
  };

  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h3>Gear to check out</h3>
      <hr />
      <h5>
        Deposit due:{" "}
        {hasFFCheck(person) ? (
          <>
            <strong style={{ color: "var(--bs-teal)" }}>{fmtAmount(0)}</strong>
             (Frequent Flyer)
          </>
        ) : (
          <strong className="text-warning">{fmtAmount(totalDeposit)}</strong>
        )}
      </h5>
      {gearToCheckout && (
        <>
          <Table>
            <thead>
              <tr>
                <th>Gear</th>
                <th>
                  <span className="d-none d-md-inline">Deposit</span>
                  <span className="d-md-none">Dep.</span>
                </th>
                <th>
                  <span className="d-none d-md-inline">Daily fee</span>
                  <span className="d-md-none">Fee</span>
                </th>
                <th>
                  <span className="d-none d-md-inline">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {gearToCheckout.map(({ id, type, dailyFee, depositAmount }) => (
                <tr key={id}>
                  <td>
                    <GearLink id={id}>{id}</GearLink>
                    <br />
                    {type.typeName}
                  </td>
                  <td>{fmtAmount(depositAmount)}</td>
                  <td>{fmtAmount(dailyFee)}</td>
                  <td className="text-end align-middle">
                    <RemoveButton onClick={() => onRemove(id)} />
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

function hasFFCheck(person: Person) {
  const today = new Date().toISOString().split("T")[0];
  return (
    person.frequentFlyerCheck != null &&
    today <= person.frequentFlyerCheck.expires
  );
}
