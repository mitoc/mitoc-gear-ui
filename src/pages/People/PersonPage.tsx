import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { peopleClient, Person } from "apiClient/people";

import { PersonProfile } from "./PersonProfile";
import { Notes } from "./Notes";
import { PersonRentals } from "./PersonRentals";

export function PersonPage() {
  const [person, setPerson] = useState<Person | null>(null);
  const { personId } = useParams<{ personId: string }>();
  useEffect(() => {
    peopleClient.getPerson(personId).then((person) => setPerson(person));
  }, [personId]);
  if (person == null) {
    return null;
  }
  return (
    <div className="row">
      <div className="col-5 p-2">
        <PersonProfile person={person} />
        <Notes notes={person.notes} />
      </div>
      <div className="col-7 p-2">
        <PersonRentals rentals={person.rentals} />
      </div>
    </div>
  );
}
