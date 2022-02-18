import { Link } from "react-router-dom";

import { GearSummary } from "apiClient/gear";
import { formatDate, formatDateTime } from "lib/fmtDate";

export function GearInfoPanel({ gearItem }: { gearItem: GearSummary }) {
  console.log({ gearItem });
  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h4>
        {gearItem.type.typeName} ({gearItem.id})
      </h4>
      <GearStatus gearItem={gearItem} />
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

function GearStatus({ gearItem }: { gearItem: GearSummary }) {
  if (gearItem.broken) {
    return (
      <div className="alert alert-danger p-2">
        <strong>Broken</strong> since {formatDateTime(gearItem.broken)}
      </div>
    );
  }
  if (gearItem.missing) {
    return (
      <div className="alert alert-danger p-2">
        <strong>Missing</strong> since {formatDateTime(gearItem.missing)}
      </div>
    );
  }
  if (gearItem.retired) {
    return (
      <div className="alert alert-danger p-2">
        <strong>Retired</strong> since {formatDateTime(gearItem.missing)}
      </div>
    );
  }
  if (gearItem.checkedOutTo) {
    const renter = gearItem.checkedOutTo;
    const rental = renter.rentals.find((r) => r.id === gearItem.id)!;
    return (
      <div className="alert alert-info p-2">
        Checked out to{" "}
        <Link to={"/people/" + renter.id}>
          <strong>
            {renter.firstName} {renter.lastName}
          </strong>
        </Link>{" "}
        on {formatDate(rental.checkedout)}.
      </div>
    );
  }
  return null;
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