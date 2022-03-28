import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAppDispatch } from "app/hooks";
import { addWaiver, Person } from "apiClient/people";
import { fetchPerson } from "features/cache/cacheSlice";
import { getNextExpirationDate } from "./utils";

type Props = {
  person: Person;
  onClose: () => void;
};

export function WaiverForm({ person, onClose }: Props) {
  const dispatch = useAppDispatch();
  const initial = getNextExpirationDate();
  const [date, setDate] = useState<Date>(initial);
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
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!date}
          onClick={(evt) => {
            evt.preventDefault();
            addWaiver(person.id, date).then(() => {
              dispatch(fetchPerson(person.id));
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
