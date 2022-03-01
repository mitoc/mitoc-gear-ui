import { GearSummary } from "apiClient/gear";

import { GearStatus } from "./GearStatus";

export function GearInfoPanel({ gearItem }: { gearItem: GearSummary }) {
  const gearStatusColor =
    gearItem.missing || gearItem.retired || gearItem.broken
      ? "alert-danger"
      : gearItem.checkedOutTo
      ? "alert-info"
      : "";
  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h4>
        {gearItem.type.typeName} ({gearItem.id})
      </h4>
      <GearStatus
        gearItem={gearItem}
        renderLinks={true}
        className={`p-2 alert ${gearStatusColor}`}
      />
      {gearItem.restricted && (
        <div className="alert alert-warning p-2">
          ⚠️ This item is restricted! Check the{" "}
          <strong>
            <a
              href="https://docs.google.com/spreadsheets/d/1CW3j4K4_HmXlDbO1vPRvIW76SI41EYNbaZKKrqmrgTk/edit?hl=en&hl=en#gid=1019012678"
              target="_blank"
            >
              Restricted gear doc
            </a>
          </strong>
          .
        </div>
      )}
      <Field value={gearItem.specification} title="Specification" />
      <Field value={gearItem.description} title="Description" />
      <Field value={gearItem.size} title="Size" />
      <Field value={formatNumber(gearItem.depositAmount)} title="Deposit" />
      <Field value={formatNumber(gearItem.dailyFee)} title="Daily Fee" />
    </div>
  );
}

function Field({ title, value }: { title: string; value?: string }) {
  if (!value) {
    return null;
  }
  return (
    <div className="text-sm">
      <strong>{title}</strong>: {value}
    </div>
  );
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatNumber(value: number): string {
  return formatter.format(value);
}
