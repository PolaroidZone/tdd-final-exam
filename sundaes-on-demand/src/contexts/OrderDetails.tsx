import { createContext, useContext, useState, FC, ReactNode } from "react";
import { pricePerItem } from "../constants";

interface OptionCounts {
  [key: string]: {
    [key: string]: number;
  };
}

interface Totals {
  scoops: number;
  toppings: number;
}

interface OrderDetailsContextValue {
  optionCounts: OptionCounts;
  totals: Totals;
  updateItemCount: (
    itemName: string,
    newItemCount: number,
    optionType: string
  ) => void;
  resetOrder: () => void;
}

const OrderDetails = createContext<OrderDetailsContextValue | undefined>(undefined);

// create custom hook to check whether we're in a provider
export function useOrderDetails() {
  const contextValue = useContext(OrderDetails);

  if (!contextValue) {
    throw new Error(
      "useOrderDetails must be called from within an OrderDetailsProvider"
    );
  }

  return contextValue;
}

interface OrderDetailsProviderProps {
  children: ReactNode;
}

export const OrderDetailsProvider: FC<OrderDetailsProviderProps> = ({
  children,
}) => {
  const [optionCounts, setOptionCounts] = useState<OptionCounts>({
    scoops: {},
    toppings: {},
  });

  function updateItemCount(
    itemName: string,
    newItemCount: number,
    optionType: string
  ) {
    // make a copy of existing state
    const newOptionCounts = { ...optionCounts };

    // update the copy with the new information
    newOptionCounts[optionType][itemName] = newItemCount;

    // update the state with the updated copy
    setOptionCounts(newOptionCounts);
  }

  function resetOrder() {
    setOptionCounts({ scoops: {}, toppings: {} });
  }

  // utility function to derive totals from optionCounts state value
  function calculateTotal(optionType: string) {
    // get an array of counts for the option type
    const countsArray = Object.values(optionCounts[optionType]);

    // total the values in the array of counts for the number of items
    const totalCount = countsArray.reduce((total, value) => total + value, 0);

    // multiply the total number of items by the price for this item type
    return totalCount * pricePerItem[optionType];
  }

  const totals: Totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  const value: OrderDetailsContextValue = {
    optionCounts,
    totals,
    updateItemCount,
    resetOrder,
  };

  return <OrderDetails.Provider value={value}>{children}</OrderDetails.Provider>;
};
