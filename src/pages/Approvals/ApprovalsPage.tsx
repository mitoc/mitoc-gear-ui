import { useState } from "react";

import { TablePagination } from "components/TablePagination";
import { useSetPageTitle } from "hooks";
import { useGetApprovalsQuery } from "redux/api";
import { DataGrid } from "components/DataGrid";
import { formatDate } from "lib/fmtDate";
import { Approval } from "apiClient/approvals";
import { PersonLink } from "components/PersonLink";
import { GearLink } from "components/GearLink";
import { Checkbox } from "components/Inputs/Checkbox";

export function ApprovalsPage() {
  useSetPageTitle("Restricted gear");
  const [showExpired, setShowExpired] = useState<boolean>(false);
  const { data } = useGetApprovalsQuery({
    past: showExpired ? undefined : false, // filter past by default, unless opting in
  });
  const [page, setPage] = useState<number>(1);
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;
  return (
    <>
      <h1>Restricted Gear Approvals</h1>
      {nbPages != null && (
        <div className="row">
          {
            <div className="col-sm-auto">
              <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
            </div>
          }

          <div className="col-md d-flex flex-grow-1 justify-content-end">
            {/* <Link to="/add-gear"> */}
            <button className="btn btn-outline-primary mb-3">
              ＋ Add approval
            </button>
            {/* </Link> */}
          </div>
        </div>
      )}
      <div className="form-switch mb-2">
        <Checkbox
          value={showExpired}
          className="me-3"
          onChange={() => setShowExpired((v) => !v)}
        />
        Show expired approvals
      </div>
      {data && <ApprovalsTable approvals={data.results} />}
    </>
  );
}

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
