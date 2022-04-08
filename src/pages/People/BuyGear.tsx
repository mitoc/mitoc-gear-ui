import { useGetPurchasablesQuery } from "features/api";
import { fmtAmount } from "lib/fmtNumber";
import { uniqueID } from "lib/uniqueID";

import type { ItemToPurchase } from "./types";

type Props = {
  onAdd: (item: ItemToPurchase) => void;
};

export function BuyGear({ onAdd }: Props) {
  const { data: items = [] } = useGetPurchasablesQuery();
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
            const { id, name, price } = item;
            return (
              <tr key={id}>
                <td className="text-center">
                  <button
                    className="btn btn-outline-primary w-100 h-100"
                    onClick={() => onAdd({ id: uniqueID(), item })}
                  >
                    Buy
                  </button>
                </td>
                <td>{name}</td>
                <td>{fmtAmount(price)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
