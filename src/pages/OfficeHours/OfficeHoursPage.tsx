import dayjs from "dayjs";
import weekOfYears from "dayjs/plugin/weekOfYear";

import { useSetPageTitle } from "hooks";
import { groupBy, isEmpty, map } from "lodash";
import { useGetOfficeHoursQuery } from "redux/api";
import styled from "styled-components";

dayjs.extend(weekOfYears);

export function OfficeHoursPage() {
  useSetPageTitle("Office Hours");
  const { data: officeHours } = useGetOfficeHoursQuery();
  const now = dayjs();
  const officeHoursByWeek = groupBy(officeHours, ({ startTime }) =>
    dayjs(startTime).week()
  );

  return (
    <div className="row">
      <div className="col-lg-8">
        <h1>Upcoming office hours</h1>

        {map(officeHoursByWeek, (officeHours, weekStr) => {
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
            <div>
              {weekTitle && <h3>{weekTitle}</h3>}
              <WeekBlock>
                {officeHours.map(({ startTime, signups }) => {
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
                  // const dayDelta = dayjs(startTime).day -
                  return (
                    <div className={`alert alert-${alertClass}`}>
                      <div>
                        <strong>{formatDateTime(startTime)}</strong>
                      </div>
                      {isEmpty(signups) ? (
                        <div>
                          <em>No one signed up yet!</em>
                        </div>
                      ) : (
                        <div>
                          {signups
                            .map((signup) => signup.deskWorker.firstName)
                            .join(", ")}
                        </div>
                      )}
                      <div className="btn-container">
                        <button
                          className={`btn btn-${buttonClass} btn-m`}
                          type="button"
                        >
                          Signup
                        </button>
                      </div>
                    </div>
                  );
                })}
              </WeekBlock>
            </div>
          );
        })}
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

  .btn-container {
    display: flex;
    justify-content: right;
  }
`;
