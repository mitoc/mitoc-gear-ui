import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";

import { getPerson, Person, Rental } from "apiClient/people";
import { GearSummary, PurchasableItem } from "apiClient/gear";
import { Notes } from "components/Notes";

import { PersonProfile } from "./PersonProfile";
import { PersonRentals } from "./PersonRentals";
import { MoreGear } from "./MoreGear";
import { BuyGear } from "./BuyGear";
import { PersonTabsSelector, PersonPageTabs } from "./PersonTabs";
import { PersonRentalsHistory } from "./PersonRentalsHistory";
import { CheckoutStaging } from "./CheckoutStaging";
import { ReturnStaging } from "./ReturnStaging";

export function PersonPage() {
  const [tab, setTab] = useState<PersonPageTabs>(PersonPageTabs.gearOut);
  const { personId } = useParams<{ personId: string }>();
  const { person, refresh: refreshPerson } = usePerson(personId);
  const {
    items: gearToCheckout,
    add: addToCheckout,
    clear: clearCheckout,
    remove: removeFromCheckout,
  } = useBasket<GearSummary>();
  const {
    items: rentalsToReturn,
    add: addToReturn,
    clear: clearReturn,
    remove: removeFromReturn,
  } = useBasket<Rental>();

  const {
    items: gearToBuy,
    add: addGearToBuy,
    remove: removeGearToBuy,
  } = useBasket<PurchasableItem>();

  if (person == null) {
    return null;
  }

  const onCheckout = () => {
    clearCheckout();
    refreshPerson();
    setTab(PersonPageTabs.gearOut);
  };

  const onReturn = () => {
    clearReturn();
    refreshPerson();
  };

  return (
    <div className="row">
      <div className="col-5 p-2">
        <PersonProfile person={person} />
        <Notes notes={person.notes} />
        {!isEmpty(gearToCheckout) && (
          <CheckoutStaging
            person={person}
            gearToCheckout={gearToCheckout}
            onRemove={removeFromCheckout}
            onCheckout={onCheckout}
          />
        )}
        {!isEmpty(rentalsToReturn) && (
          <ReturnStaging
            person={person}
            rentalsToReturn={rentalsToReturn}
            onRemove={removeFromReturn}
            onReturn={onReturn}
          />
        )}
      </div>
      <div className="col-7 p-2">
        <PersonTabsSelector activeTab={tab} updateTab={setTab} />
        {tab === PersonPageTabs.gearOut && (
          <PersonRentals
            rentals={person.rentals}
            rentalsToReturn={rentalsToReturn}
            onReturn={addToReturn}
          />
        )}
        {tab === PersonPageTabs.moreGear && (
          <MoreGear onAddGear={addToCheckout} gearToCheckout={gearToCheckout} />
        )}
        {tab === PersonPageTabs.buyGear && <BuyGear onAdd={addGearToBuy} />}
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

function useBasket<T extends { id: string }>() {
  const [items, setItems] = useState<T[]>([]);
  const add = (item: T) => setItems((gear) => [...gear, item]);

  const remove = (id: string) =>
    setItems((gear) => gear.filter((i) => i.id !== id));

  const clear = () => setItems([]);

  return {
    items,
    add,
    remove,
    clear,
  };
}
