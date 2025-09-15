import { isEmpty } from "lodash";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { addNote, archiveNote } from "src/apiClient/people";
import { Notes } from "src/components/Notes";
import { useSetPageTitle } from "src/hooks";
import { useGetPersonQuery } from "src/redux/api";

import { BuyGear } from "./BuyGear";
import { CheckoutStaging } from "./CheckoutStaging";
import { MoreGear } from "./MoreGear";
import {
  PersonPageContextProvider,
  usePersonPageContext,
} from "./PeoplePage/PersonPageContext";
import { PersonProfile } from "./PersonProfile";
import { PersonRentals } from "./PersonRentals";
import { PersonRentalsHistory } from "./PersonRentalsHistory";
import { PersonPageTabs, PersonTabsSelector } from "./PersonTabs";
import { ReturnStaging } from "./ReturnStaging";

export function PersonPage() {
  const { personId } = useParams<{ personId: string }>();
  const { data: person, refetch: refreshPerson } = useGetPersonQuery(personId);
  if (person == null) {
    return null;
  }
  return (
    <PersonPageContextProvider person={person} refreshPerson={refreshPerson}>
      <PersonPageInner />
    </PersonPageContextProvider>
  );
}

function PersonPageInner() {
  const [tab, setTab] = useState<PersonPageTabs>(PersonPageTabs.gearOut);

  const {
    person,
    refreshPerson,
    checkoutBasket,
    returnBasket,
    purchaseBasket,
  } = usePersonPageContext();

  useSetPageTitle(person ? `${person.firstName} ${person.lastName} ` : "");

  const isOverdue = person.rentals.some((rental) => rental.weeksOut >= 7);

  return (
    <div className="row">
      {isOverdue && (
        <div className="alert alert-danger" role="alert">
          Please remind renter to return overdue gear!
        </div>
      )}
      <div className="col-12 col-md-5 p-2">
        <PersonProfile />
        <Notes
          notes={person.notes}
          onAdd={(note) => {
            return addNote(person.id, note).then(refreshPerson);
          }}
          onArchive={(noteId) => {
            archiveNote(person.id, noteId).then(refreshPerson);
          }}
        />
        {!isEmpty(checkoutBasket.items) && (
          <CheckoutStaging
            onCheckout={() => {
              setTab(PersonPageTabs.gearOut);
            }}
          />
        )}
        {(!isEmpty(returnBasket.items) || !isEmpty(purchaseBasket.items)) && (
          <ReturnStaging />
        )}
      </div>
      <div className="col-12 col-md-7 p-2">
        <PersonTabsSelector activeTab={tab} updateTab={setTab} />
        {tab === PersonPageTabs.gearOut && <PersonRentals />}
        {tab === PersonPageTabs.moreGear && <MoreGear />}
        {tab === PersonPageTabs.buyGear && <BuyGear />}
        {tab === PersonPageTabs.rentalHistory && (
          <PersonRentalsHistory personId={person.id} />
        )}
      </div>
    </div>
  );
}
