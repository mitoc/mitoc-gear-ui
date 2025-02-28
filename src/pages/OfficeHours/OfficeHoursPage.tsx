import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekOfYears from "dayjs/plugin/weekOfYear";
import { groupBy, isEmpty, map } from "lodash";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { cancelSignUp, signUp } from "apiClient/officeHours";
import { OfficeHour, User } from "apiClient/types";
import { PersonLink } from "components/PersonLink";
import { useSetPageTitle } from "hooks";
import { useGetOfficeHoursQuery } from "redux/api";
import {
  Roles,
  useCurrentUser,
  useCurrentUserReload,
  usePermissions,
} from "redux/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";
import { updatePersonGroups } from "apiClient/people";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

dayjs.extend(weekOfYears);
dayjs.extend(customParseFormat);

export function OfficeHoursPage() {
  useSetPageTitle("Office Hours");
  const { data: officeHours } = useGetOfficeHoursQuery();
  const { user } = useCurrentUser();

  if (!user) {
    return null;
  }

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
        <OfficeAccessBanner />

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

function OfficeAccessBanner() {
  const { hasOfficeAccess } = usePermissions();
  const { user } = useCurrentUser();
  const reloadUser = useCurrentUserReload();
  const { refetch: reloadOfficeHours } = useGetOfficeHoursQuery();

  const reload = () => {
    reloadUser();
    reloadOfficeHours();
  };

  return hasOfficeAccess ? (
    <div className="alert alert-success">
      <FontAwesomeIcon icon={faIdCard} /> You have office access 🎉. If that's
      not the case anymore, click{" "}
      <UnstyledButton onClick={() => removeOfficeAccess(user, reload)}>
        here
      </UnstyledButton>
      .
    </div>
  ) : (
    <div className="alert alert-warning">
      <FontAwesomeIcon icon={faIdCard} /> You do <b>not</b> have office access
      😢. If you actually do, click{" "}
      <UnstyledButton onClick={() => addOfficeAccess(user, reload)}>
        here
      </UnstyledButton>
      .
    </div>
  );
}

function IconWithTooltip({ icon, text }: { icon: IconProp; text: string }) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{text}</Tooltip>}>
      {({ ref, ...triggerHandler }) => (
        <FontAwesomeIcon
          icon={icon}
          ref={ref}
          data-toggle="tooltip"
          data-placement="top"
          {...triggerHandler}
        />
      )}
    </OverlayTrigger>
  );
}

function UnstyledButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="btn btn-link p-0 border-0 align-baseline"
      onClick={onClick}
    >
      {children}
    </button>
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
              {signup.deskWorker.hasOfficeAccess && (
                <>
                  <IconWithTooltip icon={faIdCard} text="Has office access" />{" "}
                </>
              )}
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

function addOfficeAccess(user: User | undefined, cb: () => void) {
  if (user == null) {
    return;
  }
  const newGroups = [...user.groups.map(({ id }) => id), Roles.OFFICE_ACCESS];
  updatePersonGroups(user.id, newGroups).then(() => {
    cb();
  });
}

function removeOfficeAccess(user: User | undefined, cb: () => void) {
  if (user == null) {
    return;
  }
  const newGroups = user.groups
    .map(({ id }) => id)
    .filter((id) => id !== Roles.OFFICE_ACCESS);
  updatePersonGroups(user.id, newGroups).then(() => {
    cb();
  });
}
