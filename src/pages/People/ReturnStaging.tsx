import { useState } from "react";
import { sum, map, mapValues, keyBy, flow, isEmpty } from "lodash";
import { formatDate } from "lib/fmtDate";

import { Person, Rental, returnGear } from "apiClient/people";
import { Checkbox } from "components/Inputs/Checkbox";
import { NumberField } from "components/Inputs/NumberField";
import { GearLink } from "components/GearLink";
import { fmtAmount } from "lib/fmtNumber";

import type { ItemToPurchase } from "./types";
import { RemoveButton } from "components/Buttons";
import styled from "styled-components";

type Props = {
  person: Person;
  rentalsToReturn: Rental[];
  gearToBuy: ItemToPurchase[];
  onRemove: (id: string) => void;
  onRemovePurchasable: (id: string) => void;
  onReturn: () => void;
};

export function ReturnStaging({
  person,
  rentalsToReturn,
  onReturn: onReturnCB,
  onRemove,
  onRemovePurchasable,
  gearToBuy,
}: Props) {
  const [checkNumber, setCheckNumber] = useState<string>("");
  const [shouldUseMitocCredit, setShouldUseMitocCredit] = useState<boolean>(
    person.mitocCredit > 0
  );
  const { rentals, toggleWaiveFee, overrideDaysOut } = useReturnState(
    rentalsToReturn,
    person.groups.some((group) => group.groupName === "BOD")
  );

  const [isWsTrip, setIsWsTrip] = useState(true);
  // const isPayingTripFee = gearToBuy.some(({ item }) => item.id === 26);

  const totalRentalsBeforeCap = sum(
    map(rentals, (item) => {
      return item.waived
        ? 0
        : item.daysOutOverride != null
        ? item.daysOutOverride * item.type.rentalAmount
        : item.totalAmount;
    })
  );
  const totalDueRentals = isWsTrip
    ? Math.min(totalRentalsBeforeCap, 15)
    : totalRentalsBeforeCap;
  const totalDue = totalDueRentals + sum(map(gearToBuy, "item.price"));

  const creditToSpent = shouldUseMitocCredit
    ? Math.min(person.mitocCredit, totalDue)
    : 0;
  const paymentDue = totalDue - creditToSpent;

  const onReturn = () => {
    returnGear(
      person.id,
      rentalsToReturn.map((rental) => ({
        id: rental.id,
      })),
      gearToBuy.map((item) => item.item.id),
      checkNumber,
      creditToSpent
    ).then(onReturnCB);
  };

  const returnOnly = isEmpty(gearToBuy);
  const purchaseOnly = isEmpty(rentalsToReturn);

  const title = purchaseOnly
    ? "Purchases"
    : returnOnly
    ? "Gear to return"
    : "Return and purchases";

  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h3>{title}</h3>
      <hr />
      <div className="form-switch mb-2">
        <Checkbox
          value={isWsTrip}
          className="me-3"
          onChange={() => setIsWsTrip((c) => !c)}
        />
        Gear rented for a Winter School trip
      </div>
      <h5>
        Payment due: <strong>{fmtAmount(paymentDue)}</strong>
      </h5>
      {person.mitocCredit > 0 && totalDue > 0 && (
        <div>
          <Checkbox
            value={shouldUseMitocCredit}
            onChange={setShouldUseMitocCredit}
          />{" "}
          Use {fmtAmount(creditToSpent)} of MITOC credit
        </div>
      )}
      <hr />

      {!isEmpty(rentalsToReturn) && (
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
              {rentalsToReturn.map(({ id, type, checkedout, weeksOut }) => (
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
                            overrideDaysOut(id, value);
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
                            toggleWaiveFee(id, value);
                          }}
                        />
                      </dd>
                    </StyledItemToReturn>
                  </td>

                  <td className="text-end align-middle ps-0">
                    <RemoveButton onClick={() => onRemove(id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {!isEmpty(gearToBuy) && (
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
              {gearToBuy.map(({ id, item: { name, price } }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{fmtAmount(price)}</td>
                  <td className="text-end align-middle">
                    <RemoveButton onClick={() => onRemovePurchasable(id)} />
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
        <button className="btn btn-primary btn-lg" onClick={onReturn}>
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

type ReturnState = Record<
  string,
  { waived?: boolean; daysOutOverride: number | null }
>;

function useReturnState(rentalsToReturn: Rental[], waiveByDefault?: boolean) {
  const [state, setState] = useState<ReturnState>({});

  const rentals = flow(
    (r: Rental[]) => keyBy(r, "id"),
    (r) =>
      mapValues(r, (rental, id) => ({
        ...rental,
        ...(waiveByDefault && { waived: true }),
        ...(state[id] ?? {}),
      }))
  )(rentalsToReturn);

  const toggleWaiveFee = (id: string, value: boolean) => {
    setState((state) => ({
      ...state,
      [id]: {
        ...(state[id] ?? {}),
        waived: value,
      },
    }));
  };

  const overrideDaysOut = (id: string, value: number | null) => {
    setState((state) => ({
      ...state,
      [id]: {
        ...(state[id] ?? {}),
        daysOutOverride: value,
      },
    }));
  };

  return { rentals, toggleWaiveFee, overrideDaysOut };
}
