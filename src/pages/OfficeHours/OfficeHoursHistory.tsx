import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Checkbox } from "src/components/Inputs/Checkbox";
import { TablePagination } from "src/components/TablePagination";
import { useSetPageTitle } from "src/hooks";
import { useGetSignupsQuery } from "src/redux/api";

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
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;
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
