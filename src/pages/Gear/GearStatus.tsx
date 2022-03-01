import { Link } from "react-router-dom";

import { GearSummary } from "apiClient/gear";
import { formatDate, formatDateTime } from "lib/fmtDate";

type Props = {
  gearItem: GearSummary;
  renderLinks?: boolean;
  className?: string;
};

export function GearStatus({
  gearItem,
  renderLinks = false,
  className,
}: Props) {
  if (gearItem.broken) {
    return (
      <div className={className}>
        <strong>Broken</strong> since {formatDateTime(gearItem.broken)}
      </div>
    );
  }
  if (gearItem.missing) {
    return (
      <div className={className}>
        <strong>Missing</strong> since {formatDateTime(gearItem.missing)}
      </div>
    );
  }
  if (gearItem.retired) {
    return (
      <div className={className}>
        <strong>Retired</strong> since {formatDateTime(gearItem.missing)}
      </div>
    );
  }
  if (gearItem.checkedOutTo) {
    const renter = gearItem.checkedOutTo;
    const rental = renter.rentals.find((r) => r.id === gearItem.id)!;
    const renderedRenter = (
      <strong>
        {renter.firstName} {renter.lastName}
      </strong>
    );
    return (
      <div className={className}>
        Checked out to{" "}
        {renderLinks ? (
          <Link to={"/people/" + renter.id}>{renderedRenter}</Link>
        ) : (
          renderedRenter
        )}{" "}
        on {formatDate(rental.checkedout)} ({rental.weeksOut} weeks ago).
      </div>
    );
  }
  return null;
}
