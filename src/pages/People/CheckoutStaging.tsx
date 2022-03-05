import { GearSummary } from "apiClient/gear";

type Props = {
  gearToCheckout: GearSummary[];
};

export function CheckoutStaging({ gearToCheckout }: Props) {
  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h3>Gear to check out</h3>
      {gearToCheckout.map((item) => (
        <div>{item.id}</div>
      ))}
    </div>
  );
}
