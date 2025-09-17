import { isEmpty } from "lodash";
import { FormProvider, useForm } from "react-hook-form";

import { approveCredit } from "src/apiClient/officeHours";
import { Signup } from "src/apiClient/types";
import { LabeledInput } from "src/components/Inputs/LabeledInput";
import { useSetPageTitle } from "src/hooks";
import { formatDate, formatDateTime, formatDuration } from "src/lib/fmtDate";
import { useGetSignupsQuery } from "src/redux/api";

export default function ApproveDeskCreditPage() {
  useSetPageTitle("Approve desk credit requests");
  const { data, refetch } = useGetSignupsQuery({
    approved: false,
    creditRequested: true,
  });
  const pendingApproval = data?.results;

  return (
    <div className="row">
      <div className="col-lg-8">
        <h1>Approve desk credit requests</h1>
        {isEmpty(pendingApproval) && data != null && (
          <div className="alert alert-success">
            No desk credit request to approve!
          </div>
        )}
        {pendingApproval?.map((signup) => {
          return (
            <SignupToApprove
              key={signup.id}
              signup={signup}
              onCreditApproved={refetch}
            />
          );
        })}
      </div>
    </div>
  );
}

type FormValues = {
  duration: string;
  credit: number;
};

function SignupToApprove({
  signup,
  onCreditApproved,
}: {
  signup: Signup;
  onCreditApproved: () => void;
}) {
  const { date, duration, creditRequested, deskWorker, note, eventType } =
    signup;
  const defaultDuration = formatDuration(duration ?? "01:00:00");
  const formObject = useForm<FormValues>({
    defaultValues: {
      duration: defaultDuration,
      credit: getDefaultCreditForDuration(defaultDuration),
    },
  });
  const { handleSubmit } = formObject;
  return (
    <FormProvider {...formObject}>
      <form
        onSubmit={handleSubmit(({ credit, duration }) => {
          approveCredit(signup.id, duration, credit).then(onCreditApproved);
        })}
        className="alert alert-secondary d-flex justify-content-between"
        key={date}
      >
        <div>
          <h4>
            {deskWorker.firstName} {deskWorker.lastName} - {formatDate(date)}
          </h4>

          <strong>{eventType}</strong>
          <br />
          <LabeledInput
            title="Duration (hh:mm):"
            type="text"
            required
            pattern="[0-9]{2}:[0-9]{2}"
            name="duration"
            inputStyle={{
              display: "inline",
              width: "unset",
              padding: "0.2rem .375rem",
              marginLeft: "0.2rem",
            }}
            options={{
              required: true,
              pattern: {
                value: /^[0-9]{2}:[0-9]{2}$/,
                message: "This must follow the hh:mm pattern.",
              },
            }}
          />
          <LabeledInput
            title="Desk credit:"
            type="text"
            required
            name="credit"
            inputStyle={{
              display: "inline",
              width: "unset",
              padding: "0.2rem .375rem",
              marginLeft: "0.2rem",
            }}
            options={{
              required: true,
            }}
          />
          {note && (
            <>
              <span>Note:{note}</span>
              <br />
            </>
          )}
          <small>Credit requested on {formatDateTime(creditRequested!)}</small>
        </div>
        <div className="d-flex align-items-end mb-3">
          <button type="submit" className="btn btn-outline-primary">
            Approve
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

function getDefaultCreditForDuration(duration: string) {
  const [hour, minute] = duration.split(":");
  return (Number(hour) + Number(minute) / 60) * 15;
}
