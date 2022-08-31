import { useEffect, useMemo } from "react";

import { useSetPageTitle } from "hooks";
import { useGetPersonSignupsQuery } from "redux/api";
import { useCurrentUser } from "redux/auth";
import Select from "react-select";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { FormProvider, useForm } from "react-hook-form";
import { formatDate, formatDateTime, formatDuration } from "lib/fmtDate";
import dayjs from "dayjs";
import { requestCredit } from "apiClient/officeHours";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";

type FormValues = {
  signup: { value: number; label: string };
  duration: string;
  note?: string;
};

export function RequestDeskCreditPage() {
  useSetPageTitle("Request desk credit");
  const { user } = useCurrentUser();
  const { data, refetch } = useGetPersonSignupsQuery({
    personID: user!.id,
    approved: false,
  });
  const today = dayjs().format("YYYY-MM-DD");

  const pendingSignups = data?.results;

  const signupOptions = useMemo(
    () =>
      pendingSignups
        ?.filter(({ creditRequested, date }) => {
          return creditRequested == null && date <= today;
        })
        ?.map(({ id, date }) => ({
          value: id,
          label: formatDate(date),
        })),
    [pendingSignups, today]
  );
  const pendingApproval = useMemo(
    () =>
      pendingSignups?.filter(({ creditRequested, approved }) => {
        return creditRequested != null && approved == null;
      }),
    [pendingSignups]
  );
  const formObject = useForm<FormValues>({
    defaultValues: { duration: "01:00", note: "" },
  });

  const { handleSubmit, reset, setValue } = formObject;

  useEffect(() => {
    // Initialize the office hour to the first one once they have loaded
    if (signupOptions != null) {
      setValue("signup", signupOptions[0]);
    }
  }, [setValue, signupOptions]);

  return (
    <div className="row">
      <div className="col-lg-8">
        <FormProvider {...formObject}>
          <h1>Request desk credit</h1>
          {data != null && isEmpty(signupOptions) && (
            <div className="alert alert-warning">
              No signup found. You can signup for today's office hours on{" "}
              <Link to="/office-hours">this page</Link>. If you forgot to signup
              for past office hours, please contact mitoc-desk@mit.edu.
            </div>
          )}
          <form
            onSubmit={handleSubmit((formValues) => {
              requestCredit(
                formValues.signup.value,
                formValues.duration,
                formValues.note
              ).then(() => {
                refetch();
                reset();
              });
            })}
          >
            <LabeledInput
              title="Office hour:"
              name="signup"
              renderComponent={({ value, onChange, onBlur, invalid }: any) => {
                return (
                  <Select
                    isLoading={!signupOptions}
                    options={signupOptions}
                    className={`w-100 ${invalid ? "is-invalid" : ""}`}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                );
              }}
              options={{
                required: true,
              }}
            />
            <LabeledInput
              title="How long did you stay: (hh:mm)"
              type="text"
              required
              pattern="[0-9]{2}:[0-9]{2}"
              name="duration"
              options={{
                required: true,
                pattern: {
                  value: /^[0-9]{2}:[0-9]{2}$/,
                  message: "This must follow the hh:mm pattern.",
                },
              }}
            />
            <LabeledInput title="Notes:" as="textarea" name="note" />
            <div className="d-flex justify-content-end mb-3">
              <button
                type="submit"
                disabled={isEmpty(signupOptions)}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </form>
        </FormProvider>
        <h2>Pending approval from the desk captain</h2>
        <>
          {pendingApproval?.map(({ date, duration, creditRequested, note }) => {
            return (
              <div className="alert alert-secondary" key={date}>
                <h4>{formatDate(date)}</h4>
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
          })}
        </>
        {data != null && isEmpty(pendingApproval) && (
          <p>No office hours pending approval</p>
        )}
      </div>
    </div>
  );
}
