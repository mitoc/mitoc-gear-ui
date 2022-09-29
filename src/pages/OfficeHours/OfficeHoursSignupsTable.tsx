import dayjs from "dayjs";

import { PersonSignup, Signup } from "apiClient/types";
import { DataGrid } from "components/DataGrid";
import { PersonLink } from "components/PersonLink";
import { formatDate, formatDuration } from "lib/fmtDate";
import { fmtAmount } from "lib/fmtNumber";

type Props<T extends PersonSignup> = {
  signups: T[];
  includeDeskWorker?: boolean;
};

export function OfficeHoursSignupsTable<T extends PersonSignup>({
  signups,
  includeDeskWorker,
}: Props<T>) {
  const columns = [
    { key: "date", header: "Date", renderer: DateCell },
    ...(includeDeskWorker
      ? [{ key: "deskWorker", header: "Desk Worker", renderer: DeskWorkerCell }]
      : []),
    { key: "eventType", header: "Event Type" },
    { key: "duration", header: "Duration", renderer: DurationCell },
    { key: "credit", header: "Credit", renderer: CreditCell },
    { key: "note", header: "Note" },
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
