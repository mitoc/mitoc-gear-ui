import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAppDispatch } from "app/hooks";
import { addMembership, Person } from "apiClient/people";
import { fetchPerson, useAffiliations } from "features/cache";
import { Select } from "components/Inputs/Select";
import { getNextExpirationDate } from "./utils";

type Props = {
  person: Person;
  onClose: () => void;
};

export function MembershipForm({ person, onClose }: Props) {
  const dispatch = useAppDispatch();
  const affiliations = useAffiliations();
  const affiliationOptions = affiliations.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const lastAffiliation = person.membership?.membershipType;
  const initial = getNextExpirationDate();
  const [date, setDate] = useState<Date>(initial);
  const [membershipType, setMembershipType] = useState<string>("");
  useEffect(() => {
    setMembershipType(lastAffiliation ?? affiliations[0].id);
  }, [affiliations]);
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
        <label className="form-group w-100 mb-2">
          Membership Type:
          <Select
            options={affiliationOptions}
            onChange={(affID) => {
              const affiliation = affiliations.find(({ id }) => id === affID)!;
              setMembershipType(affiliation.id);
            }}
            value={membershipType}
          />
        </label>
        <br />

        <button
          className="btn btn-primary"
          type="submit"
          disabled={!date}
          onClick={(evt) => {
            evt.preventDefault();
            if (membershipType == null) {
              return;
            }
            addMembership(person.id, date, membershipType).then(() => {
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