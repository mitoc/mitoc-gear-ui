import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

import { Approval, deleteApproval } from "apiClient/approvals";
import { ApprovalItemsList } from "components/ApprovalItemsList";
import { DataGrid } from "components/DataGrid";
import { formatDate } from "lib/fmtDate";
import { PersonBase } from "apiClient/people";
import { PersonLink } from "components/PersonLink";

export function ApprovalsTable({
  approvals,
  onDelete,
}: {
  approvals: Approval[];
  onDelete: () => void;
}) {
  const LocalDeleteCell = useMemo(() => {
    const component = ({ item }: { item: Approval }) => (
      <DeleteCell item={item} onDelete={onDelete} />
    );
    component.displayName = "LocalDeleteCell";
    return component;
  }, [onDelete]);
  const columns = [
    { key: "deskWorker", header: "Renter", renderer: RenterCell, width: 0.8 },
    {
      key: "items",
      header: "Gear approved",
      renderer: ItemsCell,
      width: 1.4,
    },
    {
      key: "startDate",
      header: "Start Date",
      renderer: StartDateCell,
      width: 0.6,
    },
    { key: "endDate", header: "End Date", renderer: EndDateCell, width: 0.6 },
    {
      key: "approvedBy",
      header: "Approved By",
      renderer: ApproverCell,
      width: 0.8,
    },
    { key: "note", header: "Note", width: 1.25 },
    { key: "delete", header: "Delete", width: 0.6, renderer: LocalDeleteCell },
  ];

  return (
    <div className="mb-5">
      <DataGrid columns={columns} data={approvals} />
    </div>
  );
}

function StartDateCell({ item: approval }: { item: Approval }) {
  return <span>{formatDate(approval.startDate)}</span>;
}
function EndDateCell({ item: approval }: { item: Approval }) {
  return <span>{formatDate(approval.endDate)}</span>;
}

function ItemsCell({ item: approval }: { item: Approval }) {
  return (
    <ApprovalItemsList
      items={approval.items}
      keyPrefix={`approval-${approval.id}`}
    />
  );
}

function RenterCell({ item: approval }: { item: Approval }) {
  return <PersonCell person={approval.renter} />;
}

function ApproverCell({ item: approval }: { item: Approval }) {
  return <PersonCell person={approval.approvedBy} />;
}

function PersonCell({ person }: { person: PersonBase }) {
  return (
    <PersonLink id={String(person.id)}>
      {person.firstName} {person.lastName}
    </PersonLink>
  );
}

function DeleteCell({
  item: approval,
  onDelete,
}: {
  item: Approval;
  onDelete: () => void;
}) {
  return (
    <div className="d-flex justify-content-center w-100">
      <button
        className="btn btn-outline-secondary"
        onClick={() => {
          const isConfirmed = window.confirm(
            "Are you sure you want to delete the approval? This action cannot be undone.",
          );
          if (isConfirmed) {
            deleteApproval(approval.id).then(() => onDelete());
          }
        }}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
}
