import { useSetPageTitle } from "hooks";
import { useGetPersonSignupsQuery } from "redux/api";
import { useCurrentUser } from "redux/auth";
import Select from "react-select";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { FormProvider, useForm } from "react-hook-form";
import { formatDate } from "lib/fmtDate";
import dayjs from "dayjs";

type FormValues = {
  signupId: number;
};

export function RequestDeskCreditPage() {
  useSetPageTitle("Request desk credit");
  const { user } = useCurrentUser();
  const { data } = useGetPersonSignupsQuery({
    personID: user!.id,
    approved: false,
  });
  const formObject = useForm<FormValues>({
    defaultValues: {},
  });
  const today = dayjs().format("YYYY-MM-DD");

  const pendingSignups = data?.results;
  const awaitingRequests = pendingSignups?.filter(
    ({ creditRequested, date }) => {
      return creditRequested == null && date <= today;
    }
  );
  const signupOptions = awaitingRequests?.map(({ id, date }) => ({
    value: id,
    label: formatDate(date),
  }));

  return (
    <div className="row">
      <div className="col-lg-8">
        <FormProvider {...formObject}>
          <h1>Request desk credit</h1>
          <LabeledInput
            title="Office hour:"
            name="signupId"
            renderComponent={({ value, onChange, onBlur, invalid }: any) => {
              return (
                <Select
                  isLoading={!awaitingRequests}
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
        </FormProvider>
      </div>
    </div>
  );
}
