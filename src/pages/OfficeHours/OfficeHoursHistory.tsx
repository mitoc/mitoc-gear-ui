import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { getPagesCount } from "apiClient/getPagesCount";
import { Checkbox } from "components/Inputs/Checkbox";
import { TablePagination } from "components/TablePagination";
import { useSetPageTitle } from "hooks";
import { useGetSignupsQuery } from "redux/api";

import { OfficeHoursSignupsTable } from "./OfficeHoursSignupsTable";

export function OfficeHoursHistory() {
  useSetPageTitle("Office Hours History");
  const [page, setPage] = useState<number>(1);
  const [showUpcoming, setShowUpcoming] = useState<boolean>(false);
  const today = dayjs().format("YYYY-MM-DD");
  const { data } = useGetSignupsQuery({
    page,
    orderBy: "-date",
    ...(!showUpcoming && { before: today }),
  });
  const nbPages = data ? getPagesCount(data) : undefined;
  useEffect(() => {
    setPage(1);
  }, [showUpcoming]);

  return (
    <>
      <h1>Office Hours History</h1>
      <div className="col-md-auto">
        {nbPages != null && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
        )}
      </div>
      <div className="form-switch mb-2">
        <Checkbox
          value={showUpcoming}
          className="me-3"
          onChange={() => setShowUpcoming((v) => !v)}
        />
        Show future office hours
      </div>
      {data && (
        <OfficeHoursSignupsTable
          signups={data.results}
          includeDeskWorker={true}
        />
      )}
    </>
  );
}
