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
      <div className="col-lg-10">
        <h1>Upcoming office hours</h1>
        <p className="text-muted fs-5">
          Sign up for office hours to help fellow members with gear rentals
        </p>
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
            <WeekSection key={weekStr}>
              {weekTitle && <WeekTitle>{weekTitle}</WeekTitle>}
              <WeekBlock>
                {officeHours.map((officeHour) => (
                  <OfficeHourBlock
                    key={officeHour.googleId}
                    officeHour={officeHour}
                  />
                ))}
              </WeekBlock>
            </WeekSection>
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
  return dayjs(date).format("ddd MM/DD YYYY, ha");
}

const WeekSection = styled.div`
  margin-bottom: 3rem;
`;

const WeekTitle = styled.h3`
  color: #34495e;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
`;

const WeekBlock = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 2rem;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .alert {
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
  }

  .btn-container {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    padding-top: 1rem;
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
