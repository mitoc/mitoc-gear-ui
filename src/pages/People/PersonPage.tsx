import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";

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
  const { person, refresh } = usePerson(personId);
  const [gearToCheckout, setGearToCheckout] = useState<GearSummary[]>([]);
  if (person == null) {
    return null;
  }
  const onAddGear = (item: GearSummary) =>
    setGearToCheckout((gear) => [...gear, item]);

  const onRemoveGear = (id: string) =>
    setGearToCheckout((gear) => gear.filter((i) => i.id !== id));

  const onCheckout = () => {
    setGearToCheckout([]);
    refresh();
    setTab(PersonPageTabs.gearOut);
  };

  return (
    <div className="row">
      <div className="col-5 p-2">
        <PersonProfile person={person} />
        <Notes notes={person.notes} />
        {tab === PersonPageTabs.moreGear && !isEmpty(gearToCheckout) && (
          <CheckoutStaging
            person={person}
            gearToCheckout={gearToCheckout}
            onRemove={onRemoveGear}
            onClear={onCheckout}
          />
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

  const refresh = () => {
    getPerson(personId).then((person) => setPerson(person));
  };

  useEffect(refresh, [personId]);

  return { person, refresh };
}
