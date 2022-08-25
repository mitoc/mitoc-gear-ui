import { useEffect, useMemo } from "react";

import { useSetPageTitle } from "hooks";
import { useGetPersonSignupsQuery } from "redux/api";
import { useCurrentUser } from "redux/auth";
import Select from "react-select";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { FormProvider, useForm } from "react-hook-form";
import { formatDate } from "lib/fmtDate";
import dayjs from "dayjs";
import { requestCredit } from "apiClient/officeHours";

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
  const formObject = useForm<FormValues>({
    defaultValues: { duration: "01:00" },
  });

  const { handleSubmit, watch, setValue } = formObject;
  const signup = watch("signup");

  useEffect(() => {
    // Initialize the office hour to the first one once they have loaded
    if (signup == null && signupOptions != null) {
      setValue("signup", signupOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, signupOptions]);

  return (
    <div className="row">
      <div className="col-lg-8">
        <FormProvider {...formObject}>
          <h1>Request desk credit</h1>
          <form
            onSubmit={handleSubmit((formValues) => {
              requestCredit(
                formValues.signup.value,
                formValues.duration,
                formValues.note
              ).then(refetch);
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
              title="How long did you stay:"
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
            <LabeledInput title="Notes:" as="textarea" name="notes" />
            <div className="d-flex justify-content-end mb-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
