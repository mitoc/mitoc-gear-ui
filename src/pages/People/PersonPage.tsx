import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPerson, Person } from "apiClient/people";
import { GearSummary } from "apiClient/gear";
import { Notes } from "components/Notes";

import { PersonProfile } from "./PersonProfile";
import { PersonRentals } from "./PersonRentals";
import { MoreGear } from "./MoreGear";
import { PersonTabsSelector, PersonPageTabs } from "./PersonTabs";
import { PersonRentalsHistory } from "./PersonRentalsHistory";
import { CheckoutStaging } from "./CheckoutStaging";

export function PersonPage() {
  const [tab, setTab] = useState<PersonPageTabs>(PersonPageTabs.gearOut);
  const { personId } = useParams<{ personId: string }>();
  const person = usePerson(personId);
  const [gearToCheckout, setGearToCheckout] = useState<GearSummary[]>([]);
  if (person == null) {
    return null;
  }
  const onAddGear = (item: GearSummary) =>
    setGearToCheckout((gear) => [...gear, item]);

  return (
    <div className="row">
      <div className="col-5 p-2">
        <PersonProfile person={person} />
        <Notes notes={person.notes} />
        {tab === PersonPageTabs.moreGear && (
          <CheckoutStaging gearToCheckout={gearToCheckout} />
        )}
      </div>
      <div className="col-7 p-2">
        <PersonTabsSelector activeTab={tab} updateTab={setTab} />
        {tab === PersonPageTabs.gearOut && (
          <PersonRentals rentals={person.rentals} />
        )}
        {tab === PersonPageTabs.moreGear && (
          <MoreGear onAddGear={onAddGear} gearToCheckout={gearToCheckout} />
        )}
        {tab === PersonPageTabs.rentalHistory && (
          <PersonRentalsHistory personId={personId} />
        )}
      </div>
    </div>
  );
}

function usePerson(personId: string) {
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    getPerson(personId).then((person) => setPerson(person));
  }, [personId]);

  return person;
}
