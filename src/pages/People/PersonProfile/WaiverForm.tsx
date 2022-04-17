import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { addWaiver, Person } from "apiClient/people";
import { getNextExpirationDate } from "./utils";
import { useGetPersonQuery } from "features/api";

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
        <label className="w-100 mb-2">
          Expires:
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            className="w-50"
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
