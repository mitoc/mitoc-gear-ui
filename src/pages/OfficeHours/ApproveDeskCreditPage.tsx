import { approveCredit } from "apiClient/officeHours";
import { Signup } from "apiClient/types";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { useSetPageTitle } from "hooks";
import { formatDate, formatDateTime } from "lib/fmtDate";
import { isEmpty } from "lodash";
import { FormProvider, useForm } from "react-hook-form";
import { useGetSignupsQuery } from "redux/api";

export function ApproveDeskCreditPage() {
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
  const { date, duration, creditRequested, deskWorker, note } = signup;
  const defaultDuration = parseDuration(duration ?? "01:00:00");
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
          <strong>
            {deskWorker.firstName} {deskWorker.lastName}
          </strong>{" "}
          on <strong>{formatDate(date)}</strong>
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
              <span>
                <strong>Note:</strong> {note}
              </span>
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

function parseDuration(duration: string) {
  return duration.split(":").slice(0, -1).join(":");
}

function getDefaultCreditForDuration(duration: string) {
  const [hour, minute] = duration.split(":");
  return (Number(hour) + Number(minute) / 60) * 15;
}
