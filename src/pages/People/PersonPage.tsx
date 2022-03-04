import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { peopleClient, Person } from "apiClient/people";
import { Notes } from "components/Notes";

import { PersonProfile } from "./PersonProfile";
import { PersonRentals } from "./PersonRentals";
import { MoreGear } from "./MoreGear";
import { PersonTabsSelector, PersonPageTabs } from "./PersonTabs";
import { PersonRentalsHistory } from "./PersonRentalsHistory";

export function PersonPage() {
  const [person, setPerson] = useState<Person | null>(null);
  const [tab, setTab] = useState<PersonPageTabs>(PersonPageTabs.gearOut);
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
        <PersonTabsSelector activeTab={tab} updateTab={setTab} />
        {tab === PersonPageTabs.gearOut && (
          <PersonRentals rentals={person.rentals} />
        )}
        {tab === PersonPageTabs.moreGear && <MoreGear />}
        {tab === PersonPageTabs.rentalHistory && <PersonRentalsHistory />}
      </div>
    </div>
  );
}
