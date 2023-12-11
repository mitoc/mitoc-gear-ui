import { useState } from "react";

import { SearchTextField } from "components/Inputs/TextField";
import { fmtAmount } from "lib/fmtNumber";
import { uniqueID } from "lib/uniqueID";
import { useGetPurchasablesQuery } from "redux/api";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";

export function BuyGear() {
  const { data: items = [] } = useGetPurchasablesQuery();
  const { purchaseBasket } = usePersonPageContext();
  const [query, setQuery] = useState<string>("");
  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3 className="mb-4">Buy gear</h3>
      <label className="w-100 mb-2 d-flex flex-row align-items-center">
        <SearchTextField
          value={query}
          onChange={(newQuery) => {
            setQuery(newQuery);
          }}
          placeholder="Search"
          debounceTime={300}
          className="mb-3"
          style={{
            width: "250px",
            maxWidth: "100%",
          }}
        />
      </label>
      <table className="table">
        <thead>
          <tr>
            <th>Buy</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items
            .filter((item) =>
              item.name.toLowerCase().includes(query.toLowerCase())
            )
            .map((item) => {
              const { id, name, price } = item;
              return (
                <tr key={id}>
                  <td className="text-center">
                    <button
                      className="btn btn-outline-primary w-100 h-100"
                      onClick={() =>
                        purchaseBasket.add({ id: uniqueID(), item })
                      }
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
