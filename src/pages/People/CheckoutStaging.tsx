import { map, sum } from "lodash";

import type { Person } from "apiClient/people";
import { RemoveButton } from "components/Buttons";
import { GearLink } from "components/GearLink";
import { fmtAmount } from "lib/fmtNumber";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";

export function CheckoutStaging({ onCheckout }: { onCheckout: () => void }) {
  const { person, checkoutBasket, isApproved } = usePersonPageContext();
  const gearToCheckout = checkoutBasket.items;
  const totalDeposit = sum(map(gearToCheckout, "depositAmount"));

  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h3>Gear to check out</h3>
      <hr />
      <h5>
        Deposit due:{" "}
        {hasFFCheck(person) ? (
          <>
            <strong style={{ color: "var(--bs-teal)" }}>{fmtAmount(0)}</strong>{" "}
            (Frequent Flyer)
          </>
        ) : (
          <strong className="text-warning">{fmtAmount(totalDeposit)}</strong>
        )}
      </h5>
      {gearToCheckout && (
        <>
          <table className="table">
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
              {gearToCheckout.map(
                ({ id, type, dailyFee, depositAmount, restricted }) => (
                  <tr key={id}>
                    <td>
                      <GearLink id={id}>{id}</GearLink>
                      <br />
                      {type.typeName}
                      {restricted && (
                        <>
                          <br />
                          {!isApproved(id, type.id) ? (
                            <strong className="text-warning">RESTRICTED</strong>
                          ) : (
                            <strong className="text-success">
                              ☑ Approved
                            </strong>
                          )}
                        </>
                      )}
                    </td>
                    <td>{fmtAmount(depositAmount)}</td>
                    <td>{fmtAmount(dailyFee)}</td>
                    <td className="text-end align-middle">
                      <RemoveButton onClick={() => checkoutBasket.remove(id)} />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </>
      )}
      <div className="text-end">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => checkoutBasket.submit().then(onCheckout)}
        >
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
