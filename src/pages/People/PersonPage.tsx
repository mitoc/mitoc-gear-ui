import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";

import { addNote, archiveNote } from "src/apiClient/people";
import { Notes } from "src/components/Notes";
import { useSetPageTitle } from "src/hooks";
import { useGetPersonQuery, useGetRenterApprovalsQuery } from "src/redux/api";

import { BuyGear } from "./BuyGear";
import { CheckoutStaging } from "./CheckoutStaging";
import {
  PersonPageContextProvider,
  usePersonPageContext,
} from "./PeoplePage/PersonPageContext";
import { PersonApprovals } from "./PersonApprovals";
import { PersonProfile } from "./PersonProfile";
import { PersonRentals } from "./PersonRentals";
import { PersonRentalsHistory } from "./PersonRentalsHistory";
import { PersonPageTabs, PersonTabsSelector, useTab } from "./PersonTabs";
import { RentGear } from "./RentGear";
import { ReturnStaging } from "./ReturnStaging";

export function PersonPage() {
  const personId = useParams<{ personId: string }>().personId!;
  const { data: person, refetch: refreshPerson } = useGetPersonQuery(personId);
  const { data: approvalResult } = useGetRenterApprovalsQuery({
    personID: personId,
    past: false,
  });
  if (person == null) {
    return null;
  }
  return (
    <PersonPageContextProvider
      person={person}
      refreshPerson={refreshPerson}
      // NOTE: This doesn't handle pagination for now, which could be a problem if someone has 50+ active approvals. Unlikely.
      approvals={approvalResult?.results ?? []}
    >
      <PersonPageInner />
    </PersonPageContextProvider>
  );
}

function PersonPageInner() {
  const [tab, setTab] = useTab();

  const {
    person,
    refreshPerson,
    checkoutBasket,
    returnBasket,
    purchaseBasket,
    isApproved,
  } = usePersonPageContext();

  useSetPageTitle(person ? `${person.firstName} ${person.lastName} ` : "");

  const isOverdue = person.rentals.some((rental) => rental.weeksOut >= 7);

  const unaprovedRestrictedItems = checkoutBasket.items.filter(
    ({ id, type, restricted }) => restricted && !isApproved(id, type.id),
  );

  return (
    <div className="row">
      {isOverdue && isEmpty(unaprovedRestrictedItems) && (
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
        {tab === PersonPageTabs.rent && <RentGear />}
        {tab === PersonPageTabs.buy && <BuyGear />}
        {tab === PersonPageTabs.approvals && <PersonApprovals />}
        {tab === PersonPageTabs.history && (
          <PersonRentalsHistory personId={person.id} />
        )}
      </div>
    </div>
  );
}
