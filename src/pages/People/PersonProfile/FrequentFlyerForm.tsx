import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { addFFChecks, Person } from "apiClient/people";
import { getNextExpirationDate } from "./utils";
import { useGetPersonQuery } from "redux/api";

type Props = {
  person: Person;
  onClose: () => void;
};

export function FrequentFlyerForm({ person, onClose }: Props) {
  const { refetch: refreshPerson } = useGetPersonQuery(String(person.id));
  const initial = getNextExpirationDate();
  const [date, setDate] = useState<Date>(initial);
  const [checkNumber, setCheckNumber] = useState<string>("");
  return (
    <div>
      <form>
        <label className="mb-2">
          Expires:
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            className="form-control"
          />
        </label>
        <br />
        <label className="mb-2">
          Check number:
          <input
            type="text"
            className="form-control"
            value={checkNumber}
            onChange={(evt) => {
              setCheckNumber(evt.target.value);
            }}
          />
        </label>
        <br />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!checkNumber || !date}
          onClick={(evt) => {
            evt.preventDefault();
            addFFChecks(person.id, date, checkNumber).then(() => {
              refreshPerson();
              onClose();
            });
          }}
        >
          Add frequent flyer checks
        </button>
        <br />
      </form>
    </div>
  );
}
