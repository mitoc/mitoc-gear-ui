import { faEdit, faPen, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import { ButtonHTMLAttributes, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styled from "styled-components";

import { Checkbox } from "components/Inputs/Checkbox";
import { NumberField } from "components/Inputs/NumberField";
import { fmtAmount } from "lib/fmtNumber";
import { useConfig } from "redux/hooks";

import { usePersonPageContext } from "../PeoplePage/PersonPageContext";

export function PaymentSummary() {
  const { isWinterSchool } = useConfig();
  const [editTotalRental, setEditTotalRental] = useState<boolean>(false);
  const {
    purchaseBasket,
    returnBasket,
    payment: {
      creditToSpent,
      paymentDue,
      potentialCreditToSpend,
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
  const canSpendCredit = potentialCreditToSpend > 0;

  // In WS always show rentals to allow overriding the amount
  const showRentalDetails =
    (isWinterSchool || hasPurchases || canSpendCredit) && hasRentals;
  // Only show purchaseable details if there are other items to show
  const showPurchaseDetails = hasPurchases && (hasRentals || canSpendCredit);

  return (
    <>
      <StyledTable className="table">
        <tbody>
          {showRentalDetails && (
            <tr>
              <th>Rental fees</th>
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
              <td>
                {isWinterSchool && (
                  <>
                    <ButtonWithTooltip
                      className="btn btn-light"
                      onClick={() => {
                        overrideTotalRentals(15);
                        setEditTotalRental(false);
                      }}
                      title="Set rentals fees to $15"
                    >
                      <FaLayer className="fa-layers fa-fw">
                        <FontAwesomeIcon icon={faPen} size="xs" />
                        <span
                          className="fa-layers-text"
                          data-fa-transform="shrink-8 down-3"
                        >
                          15
                        </span>
                      </FaLayer>
                    </ButtonWithTooltip>
                    <ButtonWithTooltip
                      className="btn btn-light"
                      onClick={() => {
                        if (totalRentalsOverride == null) {
                          overrideTotalRentals(totalRentals);
                        }
                        setEditTotalRental((v) => !v);
                      }}
                      title="Manually set rental fees"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </ButtonWithTooltip>
                    <ButtonWithTooltip
                      className="btn btn-light"
                      title="Reset rentals fees to default"
                      onClick={() => {
                        overrideTotalRentals(null);
                        setEditTotalRental(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                    </ButtonWithTooltip>
                  </>
                )}
              </td>
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
          {canSpendCredit && (
            <tr>
              <th>MITOC Credit</th>
              <td className="text-end">
                <span>
                  {shouldUseMitocCredit ? (
                    fmtAmount(-creditToSpent)
                  ) : (
                    <em>Not applied</em>
                  )}
                </span>
              </td>
              <td>
                <span className="form-switch ms-2">
                  <Checkbox
                    value={shouldUseMitocCredit}
                    className="me-3"
                    onChange={() => setShouldUseMitocCredit((v) => !v)}
                  />
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <h5>
        Payment due: <strong>{fmtAmount(paymentDue)} </strong>
      </h5>
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

const FaLayer = styled.span`
  .fa-layers-text {
    transform: translate(-0.1em, 0);
    font-size: 0.7em;
    font-weight: 600;
  }
`;

function ButtonWithTooltip(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{props.title}</Tooltip>}>
      {({ ref, ...triggerHandler }) => (
        <button
          ref={ref}
          type="button"
          data-toggle="tooltip"
          data-placement="top"
          {...triggerHandler}
          {...props}
        />
      )}
    </OverlayTrigger>
  );
}
