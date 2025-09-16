import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { isEmpty, sortBy } from "lodash";

import { RenterApproval } from "src/apiClient/approvals";
import { AddApprovalLink } from "src/components/AddApprovalLink";
import { ApprovalItemsList } from "src/components/ApprovalItemsList";
import { PersonLink } from "src/components/PersonLink";
import { formatDate } from "src/lib/fmtDate";
import { usePermissions } from "src/redux/auth";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export function PersonApprovals() {
  const { isApprover } = usePermissions();
  const { person, approvals: unsortedApprovals } = usePersonPageContext();
  const approvals = sortBy(unsortedApprovals, "startDate");

  return (
    <div className="border rounded-2 p-2 bg-light">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Approvals</h3>
        {isApprover && <AddApprovalLink personId={person.id} />}
      </div>
      {!isEmpty(approvals) ? (
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
      ) : (
        <p>No approvals.</p>
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
