import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

import { ApprovalItemsList } from "components/ApprovalItemsList";
import { PersonLink } from "components/PersonLink";
import { formatDate } from "lib/fmtDate";
import { useGetRenterApprovalsQuery } from "redux/api";
import { RenterApproval } from "apiClient/approvals";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";
import { isEmpty, partition } from "lodash";

export function PersonApprovals() {
  const { person } = usePersonPageContext();
  const { data: approvals, isLoading } = useGetRenterApprovalsQuery({
    personID: person.id,
    past: false,
  });

  if (isLoading) {
    return (
      <div className="border rounded-2 p-2 bg-light">
        <h3>Approvals</h3>
        <p>Loading approvals...</p>
      </div>
    );
  }

  if (!approvals?.results.length) {
    return (
      <div className="border rounded-2 p-2 bg-light">
        <h3>Approvals</h3>
        <p>No approvals.</p>
      </div>
    );
  }

  const today = dayjs().startOf("day");

  const [activeApprovals, futureApprovals] = partition(
    approvals.results,
    (approval) => {
      const startDate = dayjs(approval.startDate).startOf("day");
      const endDate = dayjs(approval.endDate).endOf("day");
      return startDate.isSameOrBefore(today) && endDate.isSameOrAfter(today);
    },
  );

  const hasFutureApprovals = !isEmpty(futureApprovals);

  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3>Approvals</h3>
      {!isEmpty(activeApprovals) && (
        <ApprovalTable
          approvals={activeApprovals}
          title={hasFutureApprovals ? "Current" : undefined}
        />
      )}
      {hasFutureApprovals && (
        <ApprovalTable approvals={futureApprovals} title="Upcoming" />
      )}
    </div>
  );
}

function ApprovalTable({
  approvals,
  title,
}: {
  approvals: RenterApproval[];
  title?: string;
}) {
  return (
    <>
      {title != null && <h5 className="mb-3 text-muted">{title}</h5>}
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
    </>
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
      <td className="d-none d-md-table-cell">
        <ApprovalItemsList items={items} />
      </td>
      <td className="d-none d-md-table-cell">
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
