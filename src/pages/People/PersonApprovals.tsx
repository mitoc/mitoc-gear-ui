import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { isEmpty, sortBy } from "lodash";

import { RenterApproval } from "apiClient/approvals";
import { ApprovalItemsList } from "components/ApprovalItemsList";
import { PersonLink } from "components/PersonLink";
import { formatDate } from "lib/fmtDate";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export function PersonApprovals() {
  const { approvals: unsortedApprovals } = usePersonPageContext();
  const approvals = sortBy(unsortedApprovals, "startDate");

  if (isEmpty(approvals)) {
    return (
      <div className="border rounded-2 p-2 bg-light">
        <h3>Approvals</h3>
        <p>No approvals.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3>Approvals</h3>
      {!isEmpty(approvals) && (
        <table className="table">
          <tbody>
            {approvals.map((approval) => {
              return (
                <tr key={approval.id}>
                  <MobileApprovalRow approval={approval} />
                  <DesktopApprovalRow approval={approval} />
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/** Row renderer for desktop display. 2 separate columns */
function DesktopApprovalRow({
  approval: { items, startDate, endDate, approvedBy, note },
}: {
  approval: RenterApproval;
}) {
  return (
    <>
      <td className="d-none d-md-table-cell w-50">
        <ApprovalItemsList items={items} />
      </td>
      <td className="d-none d-md-table-cell w-50">
        <DateRange startDate={startDate} endDate={endDate} />
        <br />
        <small className="text-muted">
          By: <ApproverInfo approvedBy={approvedBy} />
        </small>
        {note && (
          <div className="mt-1">
            <small className="text-muted">{note}</small>
          </div>
        )}
      </td>
    </>
  );
}

/** Row renderer for mobile display. Single column with stacked info */
function MobileApprovalRow({
  approval: { items, startDate, endDate, approvedBy, note },
}: {
  approval: RenterApproval;
}) {
  return (
    <td className="d-md-none">
      <div className="mb-2">
        <strong>Items:</strong>
        <ApprovalItemsList items={items} />
      </div>
      <div className="mb-2">
        <strong>Period:</strong>{" "}
        <DateRange startDate={startDate} endDate={endDate} />
      </div>
      <div className="mb-2">
        <strong>By:</strong> <ApproverInfo approvedBy={approvedBy} />
      </div>
      <ApprovalNote note={note} />
    </td>
  );
}

function ApproverInfo({
  approvedBy,
}: {
  approvedBy: RenterApproval["approvedBy"];
}) {
  return (
    <PersonLink id={String(approvedBy.id)}>
      {approvedBy.firstName} {approvedBy.lastName}
    </PersonLink>
  );
}

function DateRange({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  return (
    <>
      {formatDate(startDate)} - {formatDate(endDate)}
    </>
  );
}

function ApprovalNote({ note }: { note?: string }) {
  if (!note) return null;
  return (
    <div className="mb-2">
      <strong>Note:</strong> {note}
    </div>
  );
}
