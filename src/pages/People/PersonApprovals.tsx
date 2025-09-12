import { ApprovalItemsList } from "components/ApprovalItemsList";
import { PersonLink } from "components/PersonLink";
import { formatDate } from "lib/fmtDate";
import { useGetRenterApprovalsQuery } from "redux/api";
import { RenterApproval } from "apiClient/approvals";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";

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

  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3>Approvals</h3>
      <table className="table">
        <tbody>
          {approvals.results.map((approval) => {
            const { id, startDate, endDate, note, approvedBy, items } =
              approval;

            return (
              <tr key={id}>
                {/* Mobile: Single column with stacked info */}
                <td className="d-md-none">
                  <div className="mb-2">
                    <strong>Items:</strong>
                    <ApprovalItemsList
                      items={items}
                      keyPrefix={`mobile-${id}`}
                    />
                  </div>
                  <div className="mb-2">
                    <strong>Period:</strong>{" "}
                    <DateRange startDate={startDate} endDate={endDate} />
                  </div>
                  <div className="mb-2">
                    <strong>By:</strong>{" "}
                    <ApproverInfo approvedBy={approvedBy} />
                  </div>
                  <ApprovalNote note={note} />
                </td>

                {/* Desktop: Separate columns */}
                <td className="d-none d-md-table-cell">
                  <ApprovalItemsList
                    items={items}
                    keyPrefix={`desktop-${id}`}
                  />
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
