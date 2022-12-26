import styled from "styled-components";
import { useState } from "react";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRefresh } from "@fortawesome/free-solid-svg-icons";

import { fmtAmount } from "lib/fmtNumber";
import { NumberField } from "components/Inputs/NumberField";
import { Checkbox } from "components/Inputs/Checkbox";

import {
  isWinterSchool,
  usePersonPageContext,
} from "../PeoplePage/PersonPageContext";

export function PaymentSummary() {
  const [editTotalRental, setEditTotalRental] = useState<boolean>(false);
  const {
    person,
    purchaseBasket,
    returnBasket,
    payment: {
      creditToSpent,
      paymentDue,
      potentialCreditToSpend,
      totalDue,
      totalPurchases,
      totalRentals,
      totalRentalsOverride,
      shouldUseMitocCredit,
      setShouldUseMitocCredit,
      overrideTotalRentals,
    },
  } = usePersonPageContext();

  const hasRentals = !isEmpty(returnBasket.items);
  const hasPurchases = !isEmpty(purchaseBasket.items);
  const isSpendingCredit = creditToSpent > 0;

  // In WS always show rentals to allow overriding the amount
  const showRentalDetails =
    (isWinterSchool || hasPurchases || isSpendingCredit) && hasRentals;
  // Only show purchaseable details if there are other items to show
  const showPurchaseDetails = hasPurchases && (hasRentals || isSpendingCredit);

  return (
    <>
      <StyledTable className="table">
        <tbody>
          {showRentalDetails && (
            <tr>
              <th>Rentals</th>
              <td className="text-end">
                {!editTotalRental ? (
                  <span>{fmtAmount(totalRentals)}</span>
                ) : (
                  <NumberField
                    value={totalRentalsOverride}
                    onChange={overrideTotalRentals}
                    small={true}
                  />
                )}
              </td>
              {isWinterSchool && (
                <td>
                  <button
                    className="btn"
                    onClick={() => {
                      if (totalRentalsOverride == null) {
                        overrideTotalRentals(totalRentals);
                      }
                      setEditTotalRental((v) => !v);
                    }}
                    title="Override rentals total"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  {
                    <button
                      className="btn"
                      title="Reset rentals total to calculated fees"
                      onClick={() => {
                        overrideTotalRentals(null);
                        setEditTotalRental(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                    </button>
                  }
                </td>
              )}
            </tr>
          )}
          {showPurchaseDetails && (
            <tr>
              <th>Purchases</th>
              <td className="text-end">
                <span>{fmtAmount(totalPurchases)}</span>
              </td>
              <td></td>
            </tr>
          )}
          {isSpendingCredit && (
            <tr>
              <th>MITOC Credit</th>
              <td className="text-end">
                <span>{fmtAmount(-creditToSpent)}</span>
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <h5>
        Payment due: <strong>{fmtAmount(paymentDue)} </strong>
      </h5>
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

const StyledTable = styled.table`
  th,
  td {
    vertical-align: middle;
  }
  td:nth-of-type(2) {
    white-space: nowrap;
    width: 1%;
  }
`;
