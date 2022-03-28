import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAppDispatch } from "app/hooks";
import { addFFChecks, Person } from "apiClient/people";
import { fetchPerson } from "features/cache/cacheSlice";
import { getNextExpirationDate } from "./utils";

type Props = {
  person: Person;
  onClose: () => void;
};

export function FrequentFlyerForm({ person, onClose }: Props) {
  const dispatch = useAppDispatch();
  const initial = getNextExpirationDate();
  const [date, setDate] = useState<Date>(initial);
  const [checkNumber, setCheckNumber] = useState<string>("");
  return (
    <div>
      <form>
        <label className="form-group w-100 mb-2">
          Expires:
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            className="w-50"
          />
        </label>
        <br />
        <label className="form-group w-50 mb-2">
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
              dispatch(fetchPerson(person.id));
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
