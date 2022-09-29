import dayjs from "dayjs";

import { Signup } from "apiClient/types";
import { useState } from "react";

import { DataGrid } from "components/DataGrid";
import { PersonLink } from "components/PersonLink";
import { TablePagination } from "components/TablePagination";
import { useSetPageTitle } from "hooks";
import { useGetSignupsQuery } from "redux/api";

// TODO:
// 1. Include toggle to hide future OH

export function OfficeHoursHistory() {
  useSetPageTitle("Office Hour Signups History");
  const [page, setPage] = useState<number>(1);
  const { data } = useGetSignupsQuery({ page });
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;

  const columns = [
    { key: "date", header: "Date" },
    { key: "deskWorker", header: "Desk Worker", renderer: DeskWorkerCell },
    { key: "eventType", header: "Event Type" },
    { key: "note", header: "Note" },
    { key: "status", header: "Status", renderer: StatusCell },
  ];
  return (
    <>
      <h1>Office Hour Signups History</h1>
      <div className="col-md-auto">
        {nbPages != null && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
        )}
      </div>
      {data && <DataGrid columns={columns} data={data.results} />}
    </>
  );
}

function DeskWorkerCell({ item: signup }: { item: Signup }) {
  return (
    <PersonLink id={signup.deskWorker.id}>
      {signup.deskWorker.firstName} {signup.deskWorker.lastName}
    </PersonLink>
  );
}

function StatusCell({ item: signup }: { item: Signup }) {
  const today = dayjs().format("YYYY-MM-DD");
  if (signup.approved) {
    return <strong className="text-success">Approved</strong>;
  }
  if (signup.creditRequested) {
    return <strong className="text-warning">Credit requested</strong>;
  }
  if (signup.date >= today) {
    return <strong className="text-secondary">Upcoming</strong>;
  }
  return <strong className="text-danger">No credit request</strong>;
}
