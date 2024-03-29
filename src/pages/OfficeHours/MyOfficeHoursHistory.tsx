import { useState } from "react";

import { TablePagination } from "components/TablePagination";
import { useSetPageTitle } from "hooks";
import { useGetPersonSignupsQuery } from "redux/api";
import { useCurrentUser } from "redux/auth";

import { OfficeHoursSignupsTable } from "./OfficeHoursSignupsTable";

export function MyOfficeHoursHistory() {
  useSetPageTitle("Office Hours History");
  const { user } = useCurrentUser();
  const [page, setPage] = useState<number>(1);
  const { data } = useGetPersonSignupsQuery({
    personID: user!.id,
    page,
    orderBy: "-date",
  });
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;

  return (
    <>
      <h1>Volunteer History</h1>
      <div className="col-md-auto">
        {nbPages != null && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
        )}
      </div>

      {data && <OfficeHoursSignupsTable signups={data.results} />}
    </>
  );
}
