import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import { addMembership, Person } from "src/apiClient/people";
import { Select } from "src/components/Inputs/Select";
import { useGetAffiliationsQuery, useGetPersonQuery } from "src/redux/api";

import { getNextExpirationDate } from "./utils";

type Props = {
  person: Person;
  onClose: () => void;
};

export function MembershipForm({ person, onClose }: Props) {
  const { refetch: refreshPerson } = useGetPersonQuery(String(person.id));
  const { data: affiliations = [] } = useGetAffiliationsQuery();
  const affiliationOptions = affiliations.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const lastAffiliation = person.membership?.membershipType;
  const initial = getNextExpirationDate();
  const [date, setDate] = useState<Date>(initial);
  const [membershipType, setMembershipType] = useState<string>("");
  useEffect(() => {
    setMembershipType(lastAffiliation ?? affiliations?.[0]?.id);
  }, [lastAffiliation, affiliations]);
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
              refreshPerson();
              onClose();
            });
          }}
        >
          Add membership
        </button>
        <br />
      </form>
    </div>
  );
}
