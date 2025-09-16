import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Select from "react-select";

import {
  requestOfficeHourCredit,
  requestOtherEventCredit,
} from "src/apiClient/officeHours";
import { LabeledInput } from "src/components/Inputs/LabeledInput";
import { formatDate } from "src/lib/fmtDate";
import { useGetPersonSignupsQuery } from "src/redux/api";
import { useCurrentUser } from "src/redux/auth";

type FormValues = {
  signup: { value: number; label: string };
  duration: string;
  note?: string;
  eventType: { value: string; label: string };
  date: string;
};

enum EventType {
  officeHour = "OH",
  inventory = "IN",
  workDay = "WD",
  other = "OT",
}

type Props = {
  onRequestSubmitted: () => void;
};

export function RequestDeskCreditForm({ onRequestSubmitted }: Props) {
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
    [pendingSignups, today],
  );
  const eventTypeOptions = [
    { value: EventType.officeHour, label: "Office hour" },
    { value: EventType.inventory, label: "Gear inventory" },
    {
      value: EventType.workDay,
      label: "Office work day (cleaning, gear maintenance, etc.)",
    },
    { value: EventType.other, label: "Other" },
  ];

  const formObject = useForm<FormValues>({
    defaultValues: {
      duration: "01:00",
      note: "",
      eventType: eventTypeOptions[0],
      date: today,
    },
  });

  const { handleSubmit, reset, setValue, watch } = formObject;

  const eventType = watch("eventType")?.value;
  const isOfficeHour = eventType === EventType.officeHour;
  const isOtherEvent = eventType === EventType.other;

  useEffect(() => {
    // Initialize the office hour to the first one once they have loaded
    if (signupOptions != null) {
      setValue("signup", signupOptions[0]);
    }
  }, [setValue, signupOptions]);

  return (
    <FormProvider {...formObject}>
      <form
        onSubmit={handleSubmit((formValues) => {
          const onAfterSubmit = () => {
            refetch();
            reset();
            onRequestSubmitted();
          };
          if (formValues.eventType?.value === EventType.officeHour) {
            return requestOfficeHourCredit(
              formValues.signup.value,
              formValues.duration,
              formValues.note,
            ).then(onAfterSubmit);
          }
          return requestOtherEventCredit(
            formValues.eventType?.value,
            formValues.date,
            formValues.duration,
            formValues.note,
          ).then(onAfterSubmit);
        })}
      >
        <LabeledInput
          title="Request credit for:"
          name="eventType"
          renderComponent={({ value, onChange, onBlur, invalid }: any) => {
            return (
              <Select
                options={eventTypeOptions}
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
        {data != null && isEmpty(signupOptions) && isOfficeHour && (
          <div className="alert alert-warning">
            No office hour signup found. You can signup for today's office hours
            on <Link to="/office-hours">this page</Link>. If you forgot to
            signup for past office hours, please pick{" "}
            <em>Request credit for: Other"</em> in the field above.
          </div>
        )}
        {isOtherEvent && (
          <div className="alert alert-warning">
            Please detail what you're asking desk credit for in the Notes field.
          </div>
        )}
        {isOfficeHour && (
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
        )}
        {!isOfficeHour && (
          <LabeledInput
            title="Date: (YYYY-MM-DD)"
            type="text"
            required
            pattern="\d{4}-\d{2}-\d{2}"
            name="date"
            options={{
              required: true,
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: "Invalid date",
              },
              validate: (value) => {
                const date = dayjs(value, "YYYY-MM-DD", true);
                if (!date.isValid()) {
                  return "Invalid date";
                }
                if (date.isAfter(today)) {
                  return "You cannot request credit for an event before its date.";
                }
                return true;
              },
            }}
          />
        )}
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
        <LabeledInput
          title="Notes:"
          as="textarea"
          name="note"
          options={{ required: isOtherEvent }}
        />
        <div className="d-flex justify-content-end mb-3">
          <button
            type="submit"
            disabled={isEmpty(signupOptions) && isOfficeHour}
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
