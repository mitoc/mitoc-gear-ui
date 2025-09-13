import { flow, keyBy, map, mapValues, partition, sum } from "lodash";
import React, { useCallback, useContext, useState } from "react";

import { RenterApproval } from "apiClient/approvals";
import { GearSummary } from "apiClient/gear";
import { checkoutGear, Person, Rental, returnGear } from "apiClient/people";

import { ItemToPurchase } from "../types";

import { useBasket } from "./useBasket";
import dayjs from "dayjs";

type PersonPageContextType = ReturnType<typeof useMakePersonPageContext>;

type Props = {
  person: Person;
  refreshPerson: () => void;
  approvals: RenterApproval[];
};

const PersonPageContext = React.createContext<
  PersonPageContextType | undefined
>(undefined);

export function PersonPageContextProvider(
  props: Props & { children: React.ReactNode },
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
      "No ReturnContext.Provider found when calling usePersonPageContext.",
    );
  }
  return context;
}

function useMakePersonPageContext({ person, refreshPerson, approvals }: Props) {
  const checkoutBasketBase = useBasket<GearSummary>();
  const returnBasketBase = useBasket<Rental>();
  const purchaseBasket = useBasket<ItemToPurchase>();
  const [shouldUseMitocCredit, setShouldUseMitocCredit] = useState<boolean>(
    person.mitocCredit > 0,
  );
  const [totalRentalsOverride, overrideTotalRentals] = useState<number | null>(
    null,
  );

  const {
    rentals: rentalsWithOverride,
    toggleWaiveFee,
    overrideDaysOut,
  } = useReturnState(
    returnBasketBase.items,
    person.groups.some((group) => group.groupName === "BOD"),
  );

  const today = dayjs().startOf("day");

  const [activeApprovals, futureApprovals] = partition(
    approvals,
    (approval) => {
      const startDate = dayjs(approval.startDate).startOf("day");
      const endDate = dayjs(approval.endDate).endOf("day");
      return startDate.isSameOrBefore(today) && endDate.isSameOrAfter(today);
    },
  );

  const isApproved = useCallback(
    (gearId: string, typeId: number) => {
      return activeApprovals.some(({ items }) => {
        return items.some((item) => {
          if (item.type === "specificItem") {
            return item.item.gearItem.id === gearId;
          }
          if (item.item.gearType.id !== typeId) {
            return false;
          }
          const checkedOut = checkoutBasketBase.items.filter(
            ({ type }) => type.id === item.item.gearType.id,
          );
          if (checkedOut.length < item.item.quantity) {
            return true;
          }
          return checkedOut
            .slice(0, item.item.quantity)
            .map((g) => g.id)
            .includes(gearId);
        });
      });
    },
    [activeApprovals],
  );

  const calculatedTotalRentals = sum(
    map(rentalsWithOverride, (item) => {
      return item.waived
        ? 0
        : item.daysOutOverride != null
          ? item.daysOutOverride * item.type.rentalAmount
          : item.totalAmount;
    }),
  );
  const totalRentals = totalRentalsOverride ?? calculatedTotalRentals;
  const totalPurchases = sum(map(purchaseBasket.items, "item.price"));
  const totalDue = totalRentals + totalPurchases;
  const potentialCreditToSpend = Math.min(person.mitocCredit, totalDue);
  const creditToSpent = shouldUseMitocCredit ? potentialCreditToSpend : 0;
  const paymentDue = totalDue - creditToSpent;

  return {
    person,
    activeApprovals,
    futureApprovals,
    isApproved,
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
          returnBasketBase.items.map((rental) => {
            return {
              id: rental.id,
              daysCharged:
                rentalsWithOverride[rental.id].daysOutOverride ??
                rental.weeksOut,
            };
          }),
          purchaseBasket.items.map((item) => item.item.id),
          checkNumber,
          creditToSpent,
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
      })),
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
