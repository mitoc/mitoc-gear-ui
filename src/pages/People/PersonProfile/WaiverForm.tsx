import "react-datepicker/dist/react-datepicker.css";

import { useState } from "react";
import DatePicker from "react-datepicker";

import { addWaiver, Person } from "apiClient/people";
import { useGetPersonQuery } from "redux/api";

import { getNextExpirationDate } from "./utils";

type Props = {
  person: Person;
  onClose: () => void;
};

export function WaiverForm({ person, onClose }: Props) {
  const { refetch: refreshPerson } = useGetPersonQuery(String(person.id));
  const initial = getNextExpirationDate();
  const [date, setDate] = useState<Date>(initial);
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
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!date}
          onClick={(evt) => {
            evt.preventDefault();
            addWaiver(person.id, date).then(() => {
              refreshPerson();
              onClose();
            });
          }}
        >
          Add waiver
        </button>
        <br />
      </form>
    </div>
  );
}
