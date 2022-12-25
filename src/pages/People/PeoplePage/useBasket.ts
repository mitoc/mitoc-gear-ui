import { useState } from "react";

export function useBasket<T extends { id: string }>() {
  const [items, setItems] = useState<T[]>([]);
  const add = (item: T) => setItems((gear) => [...gear, item]);

  const remove = (id: string) =>
    setItems((gear) => gear.filter((i) => i.id !== id));

  const clear = () => setItems([]);

  return {
    items,
    add,
    remove,
    clear,
  };
}
