import React, { useContext, useState } from "react";

import { flow, keyBy, map, mapValues, sum } from "lodash";
import { checkoutGear, Person, Rental, returnGear } from "apiClient/people";
import { GearSummary } from "apiClient/gear";

import { ItemToPurchase } from "../types";

import { useBasket } from "./useBasket";

export const isWinterSchool = true; // TODO: This could be read from the database

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
  const [totalRentalsOverride, overrideTotalRentals] = useState<number | null>(
    null
  );

  const {
    rentals: rentalsWithOverride,
    toggleWaiveFee,
    overrideDaysOut,
  } = useReturnState(
    returnBasketBase.items,
    person.groups.some((group) => group.groupName === "BOD")
  );

  const calculatedTotalRentals = sum(
    map(rentalsWithOverride, (item) => {
      return item.waived
        ? 0
        : item.daysOutOverride != null
        ? item.daysOutOverride * item.type.rentalAmount
        : item.totalAmount;
    })
  );
  const totalRentals = totalRentalsOverride ?? calculatedTotalRentals;
  const totalPurchases = sum(map(purchaseBasket.items, "item.price"));
  const totalDue = totalRentals + totalPurchases;
  const potentialCreditToSpend = Math.min(person.mitocCredit, totalDue);
  const creditToSpent = shouldUseMitocCredit ? potentialCreditToSpend : 0;
  const paymentDue = totalDue - creditToSpent;

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
          creditToSpent
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
      creditToSpent,
      paymentDue,
      potentialCreditToSpend,
      shouldUseMitocCredit,
      totalDue,
      totalPurchases,
      totalRentals,
      totalRentalsOverride,
      setShouldUseMitocCredit,
      overrideTotalRentals,
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
