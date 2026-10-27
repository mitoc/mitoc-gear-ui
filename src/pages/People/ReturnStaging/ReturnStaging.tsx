import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import { useState } from "react";
import styled from "styled-components";

import { FeeStatus } from "src/apiClient/people";
import { RemoveButton } from "src/components/Buttons";
import { GearLink } from "src/components/GearLink";
import { NumberField } from "src/components/Inputs/NumberField";
import { Select } from "src/components/Inputs/Select";
import { formatDate } from "src/lib/fmtDate";
import { fmtAmount } from "src/lib/fmtNumber";
import { useConfig } from "src/redux/hooks";

import { usePersonPageContext } from "../PeoplePage/PersonPageContext";

import { PaymentSummary } from "./PaymentSummary";
import { WinterSchoolDisclaimer } from "./WinterSchoolDisclaimer";

const feeOptions: { value: FeeStatus; label: string }[] = [
  { value: "charge", label: "Charge fee" },
  { value: "coveredByTrip", label: "Covered by trip fee" },
  { value: "clubOfficial", label: "Waived - Club official" },
  { value: "waived", label: "Waived - Other reason" },
];

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
                  <td>
                    <StyledItemToReturn>
                      <RemoveIcon
                        aria-label="Remove"
                        title="Remove"
                        onClick={() => returnBasket.remove(id)}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </RemoveIcon>
                      <dt className="d-md-none">
                        <GearLink id={id}>{id}</GearLink>
                      </dt>
                      <dd className="d-md-none">{type.typeName}</dd>
                      <dt>Out since:</dt>
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
                      <dt>Fee:</dt>
                      <dd>
                        <Select
                          className="form-select form-select-sm w-auto"
                          value={rentals[id].feeStatus}
                          onChange={(value) => {
                            returnBasket.setFeeStatus(id, value as FeeStatus);
                          }}
                          options={feeOptions}
                        />
                      </dd>
                    </StyledItemToReturn>
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
              {purchaseBasket.items.map((p) => {
                const name = p.kind === "catalog" ? p.item.name : p.description;
                const price = p.kind === "catalog" ? p.item.price : p.price;
                return (
                  <tr key={p.id}>
                    <td>{name}</td>
                    <td>{fmtAmount(price)}</td>
                    <td className="text-end align-middle">
                      <RemoveButton
                        onClick={() => purchaseBasket.remove(p.id)}
                      />
                    </td>
                  </tr>
                );
              })}
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
            maxLength={16}
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
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1rem;
  padding-right: 1.5rem;

  dd {
    margin-bottom: 0;
  }

  dt {
    font-weight: inherit;
    white-space: nowrap;
  }
`;

const RemoveIcon = styled.button`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 50%;
  background: none;
  line-height: 1;
  color: #6c757d;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out;

  &:hover {
    color: #dc3545;
    background-color: rgba(220, 53, 69, 0.1);
  }
`;
