import { PurchasableItem } from "apiClient/gear";
import { usePurchasableItems } from "features/cache/hooks";

type Props = {
  onAdd: (item: PurchasableItem) => void;
};

export function BuyGear({ onAdd }: Props) {
  const items = usePurchasableItems();
  return (
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
                  onClick={() => onAdd(item)}
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
  );
}
