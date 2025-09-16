import { isEmpty } from "lodash";
import { useMemo, useState } from "react";

import { useSetPageTitle } from "src/hooks";
import { formatDate, formatDateTime, formatDuration } from "src/lib/fmtDate";
import { useGetPersonSignupsQuery } from "src/redux/api";
import { useCurrentUser } from "src/redux/auth";

import { RequestDeskCreditForm } from "./RequestDeskCreditForm";
import { RequestDeskCreditResults } from "./RequestDeskCreditResults";

export function RequestDeskCreditPage() {
  useSetPageTitle("Request desk credit");
  const { user } = useCurrentUser();
  const { data } = useGetPersonSignupsQuery({
    personID: user!.id,
    approved: false,
  });
  const [showForm, setShowForm] = useState<boolean>(true);

  const pendingSignups = data?.results;

  const pendingApproval = useMemo(
    () =>
      pendingSignups?.filter(({ creditRequested, approved }) => {
        return creditRequested != null && approved == null;
      }),
    [pendingSignups],
  );

  return (
    <div className="row">
      <div className="col-lg-8">
        <h1>Request desk credit</h1>
        {showForm ? (
          <RequestDeskCreditForm
            onRequestSubmitted={() => setShowForm(false)}
          />
        ) : (
          <RequestDeskCreditResults
            submitNewRequest={() => setShowForm(true)}
          />
        )}

        <h2>Pending approval from the desk captain</h2>
        <>
          {pendingApproval?.map(
            ({ date, duration, creditRequested, note, eventType }) => {
              return (
                <div className="alert alert-secondary" key={date}>
                  <h4>{formatDate(date)}</h4>
                  <strong>{eventType}</strong>
                  <br />
                  <strong>Duration:</strong> {formatDuration(duration!)}
                  <br />
                  {note && (
                    <>
                      <span>
                        <strong>Note:</strong> {note}
                      </span>
                      <br />
                    </>
                  )}
                  <small>
                    Credit requested on {formatDateTime(creditRequested!)}
                  </small>
                </div>
              );
            },
          )}
        </>
        {data != null && isEmpty(pendingApproval) && (
          <p>No office hours pending approval</p>
        )}
      </div>
    </div>
  );
}
