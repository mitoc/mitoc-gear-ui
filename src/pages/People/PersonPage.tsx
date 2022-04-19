import { useState } from "react";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";

import { Rental, addNote, archiveNote } from "apiClient/people";
import { GearSummary } from "apiClient/gear";
import { Notes } from "components/Notes";
import { useGetPersonQuery } from "features/api";

import { PersonProfile } from "./PersonProfile";
import { PersonRentals } from "./PersonRentals";
import { MoreGear } from "./MoreGear";
import { BuyGear } from "./BuyGear";
import { PersonTabsSelector, PersonPageTabs } from "./PersonTabs";
import { PersonRentalsHistory } from "./PersonRentalsHistory";
import { CheckoutStaging } from "./CheckoutStaging";
import { ReturnStaging } from "./ReturnStaging";
import type { ItemToPurchase } from "./types";
import { useSetPageTitle } from "hooks";

export function PersonPage() {
  const [tab, setTab] = useState<PersonPageTabs>(PersonPageTabs.gearOut);
  const { personId } = useParams<{ personId: string }>();

  const { data: person, refetch: refreshPerson } = useGetPersonQuery(personId);

  useSetPageTitle(person ? `${person.firstName} ${person.lastName} ` : "");

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
    clear: clearPurchases,
  } = useBasket<ItemToPurchase>();

  if (person == null) {
    return null;
  }

  const isOverdue = person.rentals.some((rental) => rental.weeksOut >= 7);

  const onCheckout = () => {
    clearCheckout();
    refreshPerson();
    setTab(PersonPageTabs.gearOut);
  };

  const onReturn = () => {
    clearReturn();
    clearPurchases();
    refreshPerson();
  };

  return (
    <div className="row">
      {isOverdue && (
        <div className="alert alert-danger" role="alert">
          Please remind renter to return overdue gear!
        </div>
      )}
      <div className="col-12 col-md-5 p-2">
        <PersonProfile person={person} refreshPerson={refreshPerson} />
        <Notes
          notes={person.notes}
          onAdd={(note) => {
            return addNote(person.id, note).then(refreshPerson);
          }}
          onArchive={(noteId) => {
            archiveNote(person.id, noteId).then(refreshPerson);
          }}
        />
        {!isEmpty(gearToCheckout) && (
          <CheckoutStaging
            person={person}
            gearToCheckout={gearToCheckout}
            onRemove={removeFromCheckout}
            onCheckout={onCheckout}
          />
        )}
        {(!isEmpty(rentalsToReturn) || !isEmpty(gearToBuy)) && (
          <ReturnStaging
            person={person}
            rentalsToReturn={rentalsToReturn}
            gearToBuy={gearToBuy}
            onRemovePurchasable={removeGearToBuy}
            onRemove={removeFromReturn}
            onReturn={onReturn}
          />
        )}
      </div>
      <div className="col-12 col-md-7 p-2">
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
