import { DataGrid } from "components/DataGrid";
import { formatDate } from "lib/fmtDate";
import { Approval } from "apiClient/approvals";
import { PersonLink } from "components/PersonLink";
import { GearLink } from "components/GearLink";

export function ApprovalsTable({ approvals }: { approvals: Approval[] }) {
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
    <ul>
      {approval.items.map(({ type, item }) => {
        if (type === "gearType") {
          return (
            <li>
              {item.gearType.typeName} ({item.gearType.shorthand}) -
              {item.quantity} items
            </li>
          );
        }
        return (
          <li>
            {item.gearItem.type.typeName} -{" "}
            <GearLink id={item.gearItem.id}>{item.gearItem.id}</GearLink>{" "}
          </li>
        );
      })}
    </ul>
  );
}

function RenterCell({ item: approval }: { item: Approval }) {
  return <PersonCell value={approval.renter} />;
}

function ApproverCell({ item: approval }: { item: Approval }) {
  return <PersonCell value={approval.approvedBy} />;
}

function PersonCell({
  value,
}: {
  value: {
    id: number;
    firstName: string;
    lastName: string;
  };
}) {
  return (
    <PersonLink id={String(value.id)}>
      {value.firstName} {value.lastName}
    </PersonLink>
  );
}
