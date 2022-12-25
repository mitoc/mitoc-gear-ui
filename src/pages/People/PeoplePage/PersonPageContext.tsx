import React, { useContext, useState } from "react";

import { checkoutGear, Person, Rental, returnGear } from "apiClient/people";

import { ItemToPurchase } from "../types";
import { useBasket } from "./useBasket";
import { GearSummary } from "apiClient/gear";
import { flow, keyBy, map, mapValues, sum } from "lodash";

type PersonPageContextType = ReturnType<typeof useMakePersonPageContext>;

type Props = {
  person: Person;
  refreshPerson: () => void;
};

const PersonPageContext = React.createContext<
  PersonPageContextType | undefined
>(undefined);

export function PersonPageContextProvider(
  props: Props & { children: React.ReactNode }
) {
  const { children, ...otherProps } = props;
  const value = useMakePersonPageContext(otherProps);
  return (
    <PersonPageContext.Provider value={value}>
      {children}
    </PersonPageContext.Provider>
  );
}

export function usePersonPageContext() {
  const context = useContext(PersonPageContext);
  if (context == null) {
    throw new Error(
      "No ReturnContext.Provider found when calling useReturnContext."
    );
  }
  return context;
}

function useMakePersonPageContext({ person, refreshPerson }: Props) {
  const checkoutBasketBase = useBasket<GearSummary>();
  const returnBasketBase = useBasket<Rental>();
  const purchaseBasket = useBasket<ItemToPurchase>();
  const [shouldUseMitocCredit, setShouldUseMitocCredit] = useState<boolean>(
    person.mitocCredit > 0
  );

  const {
    rentals: rentalsWithOverride,
    toggleWaiveFee,
    overrideDaysOut,
  } = useReturnState(
    returnBasketBase.items,
    person.groups.some((group) => group.groupName === "BOD")
  );

  const paymentData = getPaymentData(
    rentalsWithOverride,
    person,
    purchaseBasket.items,
    shouldUseMitocCredit
  );

  return {
    person,
    refreshPerson,
    purchaseBasket,
    returnBasket: {
      ...returnBasketBase,
      rentalsWithOverride,
      toggleWaiveFee,
      overrideDaysOut,
      submit(checkNumber: string) {
        return returnGear(
          person.id,
          returnBasketBase.items.map((rental) => ({
            id: rental.id,
          })),
          purchaseBasket.items.map((item) => item.item.id),
          checkNumber,
          paymentData.creditToSpent
        ).then(() => {
          returnBasketBase.clear();
          purchaseBasket.clear();
          refreshPerson();
        });
      },
    },
    checkoutBasket: {
      ...checkoutBasketBase,
      submit() {
        const gearIDs = map(checkoutBasketBase.items, "id");
        return checkoutGear(person.id, gearIDs).then(() => {
          checkoutBasketBase.clear();
          refreshPerson();
        });
      },
    },
    payment: {
      ...paymentData,
      shouldUseMitocCredit,
      setShouldUseMitocCredit,
    },
  };
}

type ReturnState = Record<
  string,
  { waived?: boolean; daysOutOverride: number | null }
>;

function useReturnState(rentalsToReturn: Rental[], waiveByDefault?: boolean) {
  const [state, setState] = useState<ReturnState>({});

  const rentals = flow(
    (r: Rental[]) => keyBy(r, "id"),
    (r) =>
      mapValues(r, (rental, id) => ({
        ...rental,
        ...(waiveByDefault && { waived: true }),
        ...(state[id] ?? {}),
      }))
  )(rentalsToReturn);

  const toggleWaiveFee = (id: string, value: boolean) => {
    setState((state) => ({
      ...state,
      [id]: {
        ...(state[id] ?? {}),
        waived: value,
      },
    }));
  };

  const overrideDaysOut = (id: string, value: number | null) => {
    setState((state) => ({
      ...state,
      [id]: {
        ...(state[id] ?? {}),
        daysOutOverride: value,
      },
    }));
  };

  return { rentals, toggleWaiveFee, overrideDaysOut };
}

function getPaymentData(
  rentalsWithOverride: ReturnType<typeof useReturnState>["rentals"],
  person: Person,
  itemsToPurchase: ItemToPurchase[],
  shouldUseCredit: boolean
) {
  const totalRentals = sum(
    map(rentalsWithOverride, (item) => {
      return item.waived
        ? 0
        : item.daysOutOverride != null
        ? item.daysOutOverride * item.type.rentalAmount
        : item.totalAmount;
    })
  );

  const totalPurchases = sum(map(itemsToPurchase, "item.price"));

  const totalDue = totalRentals + totalPurchases;

  const potentialCreditToSpend = Math.min(person.mitocCredit, totalDue);

  const creditToSpent = shouldUseCredit ? potentialCreditToSpend : 0;
  const paymentDue = totalDue - creditToSpent;

  return {
    totalRentals,
    totalPurchases,
    totalDue,
    potentialCreditToSpend,
    creditToSpent,
    paymentDue,
  };
}
