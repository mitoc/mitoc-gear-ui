import { fmtAmount } from "lib/fmtNumber";

import { usePersonPageContext } from "../PeoplePage/PersonPageContext";
import { Checkbox } from "components/Inputs/Checkbox";

export function PaymentSummary() {
  const {
    person,
    payment: {
      creditToSpent,
      paymentDue,
      potentialCreditToSpend,
      totalDue,
      totalPurchases,
      totalRentals,
      shouldUseMitocCredit,
      setShouldUseMitocCredit,
    },
  } = usePersonPageContext();

  return (
    <>
      <table className="table">
        {totalRentals > 0 && totalRentals !== paymentDue && (
          <tr>
            <th>Rentals</th>
            <td className="text-end">
              <span>{fmtAmount(totalRentals)}</span>
            </td>
            <td>✏️</td>
          </tr>
        )}
        {totalPurchases > 0 && totalPurchases !== paymentDue && (
          <tr>
            <th>Purchases</th>
            <td className="text-end">
              <span>{fmtAmount(totalPurchases)}</span>
            </td>
          </tr>
        )}
        {totalPurchases > 0 && totalRentals > 0 && potentialCreditToSpend > 0 && (
          <tr>
            <th>Total</th>
            <td className="text-end">
              <span>{fmtAmount(totalDue)}</span>
            </td>
          </tr>
        )}
        {potentialCreditToSpend > 0 && (
          <tr>
            <th>MITOC Credit</th>
            <td className="text-end">
              <span>{fmtAmount(-creditToSpent)}</span>
            </td>
          </tr>
        )}
        {/* <tr>
          <th>Payment due</th>
          <td className="text-end">
            <strong>{fmtAmount(paymentDue)}</strong>
          </td>
        </tr> */}
      </table>
      <h5>
        Payment due: <strong>{fmtAmount(paymentDue)}</strong>
      </h5>
      {/* <NumberField value={paymentDue} onChange={(value) => {}} small={true} /> */}
      {person.mitocCredit > 0 && totalDue > 0 && (
        <div>
          <Checkbox
            value={shouldUseMitocCredit}
            onChange={setShouldUseMitocCredit}
          />{" "}
          Use {fmtAmount(potentialCreditToSpend)} of MITOC credit
        </div>
      )}
    </>
  );
}
