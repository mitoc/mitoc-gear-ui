import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekOfYears from "dayjs/plugin/weekOfYear";
import { groupBy, isEmpty, map } from "lodash";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { cancelSignUp, signUp } from "apiClient/officeHours";
import { OfficeHour } from "apiClient/types";
import { PersonLink } from "components/PersonLink";
import { useSetPageTitle } from "hooks";
import { useGetOfficeHoursQuery } from "redux/api";
import { useCurrentUser } from "redux/auth";

dayjs.extend(weekOfYears);
dayjs.extend(customParseFormat);

export function OfficeHoursPage() {
  useSetPageTitle("Office Hours");
  const { data: officeHours } = useGetOfficeHoursQuery();

  const now = dayjs();
  const officeHoursByWeek = groupBy(officeHours, ({ startTime }) => {
    const time = dayjs(startTime);
    const week = time.week();
    const year = time.year();
    return [year, week];
  });

  return (
    <div className="row">
      <div className="col-lg-8">
        <h1>Upcoming office hours</h1>

        {map(officeHoursByWeek, (officeHours, yearWeekStr) => {
          const weekStr = yearWeekStr.split(",")[1];
          const week = Number(weekStr);
          const weekTitle =
            week === now.week()
              ? "This Week"
              : week === now.add(1, "week").week() // Cannot just use now.week() + 1, since week number resets every year
                ? "Next week"
                : week === now.add(2, "week").week()
                  ? "Future Weeks"
                  : null;

          return (
            <div key={weekStr}>
              {weekTitle && <h3>{weekTitle}</h3>}
              <WeekBlock>
                {officeHours.map((officeHour) => (
                  <OfficeHourBlock
                    key={officeHour.googleId}
                    officeHour={officeHour}
                  />
                ))}
              </WeekBlock>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OfficeHourBlock({ officeHour }: { officeHour: OfficeHour }) {
  const { user } = useCurrentUser();
  const [isSignupProcessing, setIsSignupProcessing] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const isLoading = isSignupProcessing || isRefetching;

  const { refetch, isFetching } = useGetOfficeHoursQuery();
  useEffect(() => {
    if (!isFetching) {
      setIsRefetching(false);
    }
  }, [isFetching]);

  const now = dayjs();
  const { startTime, signups, googleId } = officeHour;
  const weekDelta = dayjs(startTime).diff(now, "week");
  const alertClass =
    Number(weekDelta) >= 1
      ? "secondary"
      : signups.length === 0
        ? "danger"
        : signups.length === 1
          ? "warning"
          : "success";
  const buttonClass = ["danger", "warning"].includes(alertClass)
    ? "primary"
    : "outline-primary";
  const userSignUp = signups.find(
    ({ deskWorker }) => deskWorker.id === user?.id,
  );
  return (
    <div className={`alert alert-${alertClass}`} key={googleId}>
      <div>
        <strong>{formatDateTime(startTime)}</strong>
      </div>
      {isLoading ? (
        <div>
          <em>Syncing with the Google Calendar...</em>
        </div>
      ) : !isEmpty(signups) ? (
        <div>
          Signed up:{" "}
          {signups.map((signup, i) => (
            <React.Fragment key={signup.deskWorker.id}>
              {i > 0 && ", "}
              <PersonLink id={signup.deskWorker.id} key={signup.deskWorker.id}>
                {signup.deskWorker.firstName}
              </PersonLink>
            </React.Fragment>
          ))}
          <br />
          {!isLoading && !userSignUp && signups.length === 1 && (
            <em>We could use more help!</em>
          )}
          {!isLoading && userSignUp && <em>You're signed up, thank you!</em>}
        </div>
      ) : (
        <div>
          <em>No one signed up yet!</em>
        </div>
      )}
      <div className="btn-container">
        {!userSignUp ? (
          <button
            className={`btn btn-${buttonClass} btn-m`}
            type="button"
            onClick={() => {
              setIsSignupProcessing(true);
              signUp(googleId).then(() => {
                setIsSignupProcessing(false);
                setIsRefetching(true);
                refetch();
              });
            }}
          >
            Sign up
          </button>
        ) : (
          <button
            className={`btn btn-outline-danger btn-m`}
            type="button"
            onClick={() => {
              setIsSignupProcessing(true);
              cancelSignUp(userSignUp.id).then(() => {
                setIsSignupProcessing(false);
                setIsRefetching(true);
                refetch();
              });
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function formatDateTime(date: string) {
  return dayjs(date).format("dddd MMM DD YYYY, hh:mma");
}

const WeekBlock = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 767px) {
    flex-direction: column;
  }

  .btn-container {
    display: flex;
    justify-content: right;
  }
`;
