import { useState } from "react";
import { sum, map, mapValues, keyBy, flow } from "lodash";
import styled from "styled-components";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { formatDate } from "lib/fmtDate";

import { Person, Rental, returnGear } from "apiClient/people";

type Props = {
  person: Person;
  rentalsToReturn: Rental[];
  onRemove: (id: string) => void;
  onReturn: () => void;
};

export function ReturnStaging({
  person,
  rentalsToReturn,
  onReturn: onReturnCB,
  onRemove,
}: Props) {
  // TODO: HANDLE BOD RENTERS
  // TODO: HANDLE MITOC CREDIT
  // TODO: HANDLE NON INTEGER DAYS OUT

  const [checkNumber, setCheckNumber] = useState<string>("");
  const { rentals, toggleWaiveFee, overrideDaysOut } = useReturnState(
    rentalsToReturn
  );

  const paymentDue = sum(
    map(rentals, (item) => {
      return item.waived
        ? 0
        : item.daysOutOverride != null
        ? item.daysOutOverride * item.type.rentalAmount
        : item.totalAmount;
    })
  );

  const onReturn = () => {
    returnGear(
      person.id,
      rentalsToReturn.map((rental) => ({
        id: rental.id,
      })),
      checkNumber
    ).then(onReturnCB);
  };

  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h3>Gear to return</h3>
      {rentalsToReturn && (
        <>
          <Table>
            <thead>
              <tr>
                <th></th>
                <th>Items</th>
                <th>Payment Due</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>{rentalsToReturn.length}</td>
                <td>{paymentDue}</td>
              </tr>
            </tbody>
          </Table>

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
                      <SmallNumberInput
                        type="number"
                        className="form-control sm"
                        value={rentals[id].daysOutOverride ?? weeksOut}
                        onChange={(evt) =>
                          // TODO: Improve this
                          overrideDaysOut(id, Number(evt.target.value))
                        }
                      ></SmallNumberInput>{" "}
                      days
                    </div>
                    Waive fee{" "}
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={rentals[id].waived}
                      onChange={() => toggleWaiveFee(id)}
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
          Return
        </button>
      </div>
    </div>
  );
}

const ArrowLessNumberInput = styled.input`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const SmallNumberInput = styled(ArrowLessNumberInput)`
  width: 2.5rem;
  display: inline;
  padding: 0.2rem;
  height: 1.5rem;
`;

type ReturnState = Record<
  string,
  { waived?: boolean; daysOutOverride?: number }
>;

function useReturnState(rentalsToReturn: Rental[]) {
  const [state, setState] = useState<ReturnState>({});

  const rentals = flow(
    (r: Rental[]) => keyBy(r, "id"),
    (r) => mapValues(r, (rental, id) => ({ ...rental, ...(state[id] ?? {}) }))
  )(rentalsToReturn);

  const toggleWaiveFee = (id: string) => {
    setState((state) => ({
      ...state,
      [id]: {
        ...(state[id] ?? {}),
        waived: !state[id]?.waived,
      },
    }));
  };

  const overrideDaysOut = (id: string, value: number | undefined) => {
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
