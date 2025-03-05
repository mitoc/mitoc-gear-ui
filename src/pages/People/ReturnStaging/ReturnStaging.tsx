import { isEmpty } from "lodash";
import { useState } from "react";
import styled from "styled-components";

import { RemoveButton } from "components/Buttons";
import { GearLink } from "components/GearLink";
import { Checkbox } from "components/Inputs/Checkbox";
import { NumberField } from "components/Inputs/NumberField";
import { formatDate } from "lib/fmtDate";
import { fmtAmount } from "lib/fmtNumber";
import { useConfig } from "redux/hooks";

import { usePersonPageContext } from "../PeoplePage/PersonPageContext";

import { PaymentSummary } from "./PaymentSummary";
import { WinterSchoolDisclaimer } from "./WinterSchoolDisclaimer";

export function ReturnStaging() {
  const { isWinterSchool } = useConfig();
  const { returnBasket, purchaseBasket } = usePersonPageContext();
  const [checkNumber, setCheckNumber] = useState<string>("");
  const rentals = returnBasket.rentalsWithOverride;
  const returnOnly = isEmpty(purchaseBasket.items);
  const purchaseOnly = isEmpty(returnBasket.items);

  const title = purchaseOnly
    ? "Purchases"
    : returnOnly
      ? "Gear to return"
      : "Return and purchases";

  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h3>{title}</h3>
      <hr />
      {!isEmpty(returnBasket.items) && isWinterSchool && (
        <WinterSchoolDisclaimer />
      )}
      <PaymentSummary />

      <hr />

      {!isEmpty(returnBasket.items) && (
        <>
          {!returnOnly && <h4>Returns</h4>}

          <table className="table">
            <thead>
              <tr>
                <th>Gear</th>
                <th className="d-none d-md-table-cell">Rental</th>
                <th>
                  <span className="d-none d-md-table-cell">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {returnBasket.items.map(({ id, type, checkedout, weeksOut }) => (
                <tr key={id}>
                  <td className="d-none d-md-table-cell">
                    <GearLink id={id}>{id}</GearLink>
                    <br />
                    {type.typeName}
                    <br />
                    Daily fee: {fmtAmount(type.rentalAmount)}
                    <br />
                  </td>
                  <td className="pe-0">
                    <StyledItemToReturn>
                      <dt className="d-md-none">
                        <GearLink id={id}>{id}</GearLink>
                      </dt>
                      <dd className="d-md-none">{type.typeName}</dd>
                      <dt>Checked on:</dt>
                      <dd>{formatDate(checkedout)}</dd>
                      <dt>Weeks out:</dt>
                      <dd>{weeksOut}</dd>
                      <dt className="d-md-none">Daily fee:</dt>
                      <dd className="d-md-none">
                        {fmtAmount(type.rentalAmount)}
                      </dd>
                      <dt>Charge for:</dt>
                      <dd>
                        <NumberField
                          value={
                            rentals[id].daysOutOverride !== undefined
                              ? rentals[id].daysOutOverride
                              : weeksOut
                          }
                          onChange={(value) => {
                            returnBasket.overrideDaysOut(id, value);
                          }}
                          integer={true}
                          small={true}
                        />{" "}
                        days
                      </dd>
                      <dt>Waive fee:</dt>
                      <dd>
                        <Checkbox
                          value={rentals[id].waived}
                          onChange={(value) => {
                            returnBasket.toggleWaiveFee(id, value);
                          }}
                        />
                      </dd>
                    </StyledItemToReturn>
                  </td>

                  <td className="text-end align-middle ps-0">
                    <RemoveButton onClick={() => returnBasket.remove(id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {!isEmpty(purchaseBasket.items) && (
        <>
          {!purchaseOnly && <h4>Purchases</h4>}

          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {purchaseBasket.items.map(({ id, item: { name, price } }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{fmtAmount(price)}</td>
                  <td className="text-end align-middle">
                    <RemoveButton onClick={() => purchaseBasket.remove(id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <label className="d-flex flex-row align-items-center mb-2">
        <span className="pe-2">Check number:</span>
        <div className="flex-grow-1 flex-shrink-0">
          <input
            type="text"
            className="form-control sm"
            value={checkNumber}
            onChange={(evt) => setCheckNumber(evt.target.value)}
          ></input>
        </div>
      </label>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => returnBasket.submit(checkNumber)}
        >
          {purchaseOnly ? "Purchase" : "Return"}
        </button>
      </div>
    </div>
  );
}
const StyledItemToReturn = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1rem;

  dd {
    margin-bottom: 0;
  }

  dt {
    font-weight: inherit;
  }
`;
