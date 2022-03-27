import { usePurchasableItems } from "features/cache/hooks";
import { uniqueID } from "lib/uniqueID";

import type { ItemToPurchase } from "./types";

type Props = {
  onAdd: (item: ItemToPurchase) => void;
};

export function BuyGear({ onAdd }: Props) {
  const items = usePurchasableItems();
  return (
    <div className="border rounded-2 p-2 bg-light">
      <table className="table">
        <thead>
          <tr>
            <th>Buy</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const { name, price } = item;
            return (
              <tr>
                <td className="text-center">
                  <button
                    className="btn btn-outline-primary w-100 h-100"
                    onClick={() => onAdd({ id: uniqueID(), item })}
                  >
                    Buy
                  </button>
                </td>
                <td>{name}</td>
                <td>{price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
