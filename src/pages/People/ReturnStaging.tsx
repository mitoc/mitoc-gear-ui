import { useState } from "react";
import { sum, map, mapValues, keyBy, flow, isEmpty } from "lodash";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { formatDate } from "lib/fmtDate";

import { Person, Rental, returnGear } from "apiClient/people";
import { Checkbox } from "components/Inputs/Checkbox";
import { NumberField } from "components/Inputs/NumberField";

import type { ItemToPurchase } from "./types";

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

  const totalDue =
    sum(
      map(rentals, (item) => {
        return item.waived
          ? 0
          : item.daysOutOverride != null
          ? item.daysOutOverride * item.type.rentalAmount
          : item.totalAmount;
      })
    ) + sum(map(gearToBuy, "item.price"));

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
      gearToBuy.map((item) => item.id),
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
      <h4>Payment due: {paymentDue}</h4>
      {person.mitocCredit > 0 && totalDue > 0 && (
        <div>
          <Checkbox
            value={shouldUseMitocCredit}
            onChange={setShouldUseMitocCredit}
          />{" "}
          Use ${creditToSpent} of MITOC credit
        </div>
      )}

      {!isEmpty(rentalsToReturn) && (
        <>
          {!returnOnly && <h4>Returns</h4>}

          <Table>
            <thead>
              <tr>
                <th>Rental</th>
                <th>Gear</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {rentalsToReturn.map(({ id, type, checkedout, weeksOut }) => (
                <tr key={id}>
                  <td>
                    Checked on: {formatDate(checkedout)}
                    <br />
                    Weeks out: {weeksOut}
                    <br />
                    <div>
                      Charge for:{" "}
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
                      />{" "}
                      days
                    </div>
                    Waive fee{" "}
                    <Checkbox
                      value={rentals[id].waived}
                      onChange={(value) => {
                        toggleWaiveFee(id, value);
                      }}
                    />
                  </td>
                  <td>
                    <Link to={`/gear/${id}`}>{id}</Link>
                    <br />
                    {type.typeName}
                    <br />
                    Daily fee: {type.rentalAmount}
                    <br />
                  </td>
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
      {!isEmpty(gearToBuy) && (
        <>
          {!purchaseOnly && <h4>Purchases</h4>}

          <Table>
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
                  <td>{price}</td>
                  <td>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => onRemovePurchasable(id)}
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
      <div className="d-flex justify-content-between">
        <label className="form-group d-flex flex-row align-items-center">
          <label className="pe-2">Check number:</label>
          <input
            type="text"
            className="form-control sm w-50"
            value={checkNumber}
            onChange={(evt) => setCheckNumber(evt.target.value)}
          ></input>
        </label>
        <button className="btn btn-primary btn-lg" onClick={onReturn}>
          {purchaseOnly ? "Purchase" : "Return"}
        </button>
      </div>
    </div>
  );
}

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
