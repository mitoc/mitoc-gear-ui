import dayjs from "dayjs";
import { flow, keyBy, map, mapValues, sum } from "lodash";
import React, { useContext, useState } from "react";

import { RenterApproval } from "src/apiClient/approvals";
import { GearSummary } from "src/apiClient/gear";
import { GearItemID } from "src/apiClient/idTypes";
import {
  checkoutGear,
  FeeStatus,
  Person,
  Rental,
  returnGear,
} from "src/apiClient/people";
import { useBeforeUnloadWarning } from "src/hooks/useBeforeUnloadWarning";
import { TagType } from "src/redux/api";
import { invalidateCache } from "src/redux/store";

import { ItemToPurchase } from "../types";

import { useBasket } from "./useBasket";

type PersonPageContextType = ReturnType<typeof useMakePersonPageContext>;

type Props = {
  person: Person;
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

function useMakePersonPageContext({ person, approvals }: Props) {
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
    setFeeStatus,
    overrideDaysOut,
  } = useReturnState(
    returnBasketBase.items,
    person.groups.some((group) => group.groupName === "BOD"),
  );

  const today = dayjs().startOf("day");

  const activeApprovals = approvals.filter((approval) => {
    const startDate = dayjs(approval.startDate).startOf("day");
    const endDate = dayjs(approval.endDate).endOf("day");
    return startDate.isSameOrBefore(today) && endDate.isSameOrAfter(today);
  });

  const isApproved = (gearId: GearItemID, typeId: number) => {
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
  };

  const calculatedTotalRentals = sum(
    map(rentalsWithOverride, (item) => {
      return item.feeStatus !== "charge"
        ? 0
        : item.daysOutOverride != null
          ? item.daysOutOverride * item.type.rentalAmount
          : item.totalAmount;
    }),
  );
  const totalRentals = totalRentalsOverride ?? calculatedTotalRentals;
  const totalPurchases = sum(
    purchaseBasket.items.map((p) =>
      p.kind === "catalog" ? p.item.price : p.price,
    ),
  );
  const totalDue = totalRentals + totalPurchases;
  const potentialCreditToSpend = Math.min(person.mitocCredit, totalDue);
  const creditToSpent = shouldUseMitocCredit ? potentialCreditToSpend : 0;
  const paymentDue = totalDue - creditToSpent;

  useBeforeUnloadWarning(
    checkoutBasketBase.items.length > 0 ||
      returnBasketBase.items.length > 0 ||
      purchaseBasket.items.length > 0,
  );

  return {
    person,
    approvals,
    isApproved,
    purchaseBasket,
    returnBasket: {
      ...returnBasketBase,
      rentalsWithOverride,
      setFeeStatus,
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
              feeStatus: rentalsWithOverride[rental.id].feeStatus,
            };
          }),
          purchaseBasket.items.map((p) =>
            p.kind === "catalog"
              ? { itemId: p.item.id }
              : { description: p.description, price: p.price },
          ),
          checkNumber,
          creditToSpent,
          paymentDue,
        ).then(() => {
          returnBasketBase.clear();
          purchaseBasket.clear();
          invalidateCache([TagType.People]);
        });
      },
    },
    checkoutBasket: {
      ...checkoutBasketBase,
      submit() {
        const gearIDs = map(checkoutBasketBase.items, "id");
        return checkoutGear(person.id, gearIDs).then(() => {
          checkoutBasketBase.clear();
          invalidateCache([TagType.People]);
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
  {
    feeStatus?: FeeStatus;
    daysOutOverride: number | null;
  }
>;

function useReturnState(rentalsToReturn: Rental[], waiveByDefault?: boolean) {
  const [state, setState] = useState<ReturnState>({});

  const rentals = flow(
    (r: Rental[]) => keyBy(r, "id"),
    (r) =>
      mapValues(r, (rental, id) => ({
        ...rental,
        feeStatus: (waiveByDefault ? "clubOfficial" : "charge") as FeeStatus,
        ...(state[id] ?? {}),
      })),
  )(rentalsToReturn);

  const setFeeStatus = (id: string, status: FeeStatus) => {
    setState((state) => ({
      ...state,
      [id]: {
        ...(state[id] ?? {}),
        feeStatus: status,
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

  return { rentals, setFeeStatus, overrideDaysOut };
}
