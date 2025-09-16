import dayjs from "dayjs";

import { PersonSignup, Signup } from "src/apiClient/types";
import { DataGrid } from "src/components/DataGrid";
import { PersonLink } from "src/components/PersonLink";
import { formatDate, formatDuration } from "src/lib/fmtDate";
import { fmtAmount } from "src/lib/fmtNumber";

type Props<T extends PersonSignup> = {
  signups: T[];
  includeDeskWorker?: boolean;
};

export function OfficeHoursSignupsTable<T extends PersonSignup>({
  signups,
  includeDeskWorker,
}: Props<T>) {
  const columns = [
    { key: "date", header: "Date", renderer: DateCell, width: 1 },
    ...(includeDeskWorker
      ? [{ key: "deskWorker", header: "Desk Worker", renderer: DeskWorkerCell }]
      : []),
    { key: "eventType", header: "Event Type", width: 1 },
    { key: "duration", header: "Duration", renderer: DurationCell, width: 0.5 },
    {
      key: "credit",
      header: "Credit",
      renderer: CreditCell,
      width: 0.5,
    },
    { key: "note", header: "Note", width: 1.5 },
    { key: "status", header: "Status", renderer: StatusCell },
  ];

  return (
    <div className="mb-5">
      <DataGrid columns={columns} data={signups} />
    </div>
  );
}

function DateCell({ item: signup }: { item: PersonSignup }) {
  return <span>{formatDate(signup.date)}</span>;
}

function DurationCell({ item: signup }: { item: PersonSignup }) {
  return signup.duration ? (
    <span>{formatDuration(signup.duration)}</span>
  ) : null;
}

function CreditCell({ item: signup }: { item: PersonSignup }) {
  return signup.credit ? <span>{fmtAmount(signup.credit)}</span> : null;
}

function DeskWorkerCell({ item: signup }: { item: PersonSignup }) {
  if (!signupContainsDeskWorker(signup)) {
    return null;
  }
  return (
    <PersonLink id={signup.deskWorker.id}>
      {signup.deskWorker.firstName} {signup.deskWorker.lastName}
    </PersonLink>
  );
}

function StatusCell({ item: signup }: { item: PersonSignup }) {
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

function signupContainsDeskWorker(signup: PersonSignup): signup is Signup {
  return (signup as Signup).deskWorker != null;
}
