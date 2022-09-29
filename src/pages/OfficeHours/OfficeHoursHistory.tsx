import dayjs from "dayjs";

import { Signup } from "apiClient/types";
import { useEffect, useState } from "react";

import { DataGrid } from "components/DataGrid";
import { PersonLink } from "components/PersonLink";
import { TablePagination } from "components/TablePagination";
import { useSetPageTitle } from "hooks";
import { useGetSignupsQuery } from "redux/api";
import { Checkbox } from "components/Inputs/Checkbox";
import { formatDate, formatDuration } from "lib/fmtDate";

export function OfficeHoursHistory() {
  useSetPageTitle("Office Hours History");
  const [page, setPage] = useState<number>(1);
  const [showUpcoming, setShowUpcoming] = useState<boolean>(false);
  const today = dayjs().format("YYYY-MM-DD");
  const { data } = useGetSignupsQuery({
    page,
    orderBy: "-date",
    ...(!showUpcoming && { before: today }),
  });
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;
  useEffect(() => {
    setPage(1);
  }, [showUpcoming]);

  const columns = [
    { key: "date", header: "Date", renderer: DateCell },
    { key: "deskWorker", header: "Desk Worker", renderer: DeskWorkerCell },
    { key: "eventType", header: "Event Type" },
    { key: "duration", header: "Duration", renderer: DurationCell },
    { key: "note", header: "Note" },
    { key: "status", header: "Status", renderer: StatusCell },
  ];
  return (
    <>
      <h1>Office Hours History</h1>
      <div className="col-md-auto">
        {nbPages != null && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
        )}
      </div>
      <div className="form-switch mb-2">
        <Checkbox
          value={showUpcoming}
          className="me-3"
          onChange={() => setShowUpcoming((v) => !v)}
        />
        Show future office hours
      </div>
      {data && (
        <div className="mb-5">
          <DataGrid columns={columns} data={data.results} />
        </div>
      )}
    </>
  );
}

function DateCell({ item: signup }: { item: Signup }) {
  return <span>{formatDate(signup.date)}</span>;
}

function DurationCell({ item: signup }: { item: Signup }) {
  return signup.duration ? (
    <span>{formatDuration(signup.duration)}</span>
  ) : null;
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
