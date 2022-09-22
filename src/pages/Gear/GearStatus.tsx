import { GearSummary } from "apiClient/gear";
import { formatDate, formatDateTime } from "lib/fmtDate";
import { PersonLink } from "components/PersonLink";

type Props = {
  gearItem: GearSummary;
  renderLinks?: boolean;
  className?: string;
  short?: boolean; // Keep message small on mobile if true
};

export function GearStatus({
  short,
  gearItem,
  renderLinks = false,
  className,
}: Props) {
  if (gearItem.broken) {
    return (
      <div className={className}>
        <strong>Broken</strong>
        <span className={short ? "d-none d-md-inline" : ""}>
          {" "}
          since {formatDateTime(gearItem.broken)}
        </span>
      </div>
    );
  }
  if (gearItem.missing) {
    return (
      <div className={className}>
        <strong>Missing</strong>
        <span className={short ? "d-none d-md-inline" : ""}>
          {" "}
          since {formatDateTime(gearItem.missing)}
        </span>
      </div>
    );
  }
  if (gearItem.retired) {
    return (
      <div className={className}>
        <strong>Retired</strong>
        <span className={short ? "d-none d-md-inline" : ""}>
          {" "}
          since {formatDateTime(gearItem.retired)}
        </span>
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
        <strong>Checked out</strong>
        <span className={short ? "d-none d-md-inline" : ""}>
          {" "}
          to{" "}
          {renderLinks ? (
            <PersonLink id={renter.id}>{renderedRenter}</PersonLink>
          ) : (
            renderedRenter
          )}{" "}
          on {formatDate(rental.checkedout)} ({rental.weeksOut} weeks ago).
        </span>
      </div>
    );
  }
  return null;
}
