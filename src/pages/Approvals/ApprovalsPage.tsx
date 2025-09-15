import { useState } from "react";
import { Link } from "react-router-dom";

import { Checkbox } from "src/components/Inputs/Checkbox";
import { TablePagination } from "src/components/TablePagination";
import { useSetPageTitle } from "src/hooks";
import { useGetApprovalsQuery } from "src/redux/api";
import { usePermissions } from "src/redux/auth";
import { useConfig } from "src/redux/hooks";

import { ApprovalsTable } from "./ApprovalsTable";

export function ApprovalsPage() {
  useSetPageTitle("Restricted gear");
  const { isApprover } = usePermissions();
  const [showExpired, setShowExpired] = useState<boolean>(false);
  const { restrictedDocUrl } = useConfig();
  const { data, refetch } = useGetApprovalsQuery({
    past: showExpired ? undefined : false, // filter past by default, unless opting in
  });
  const [page, setPage] = useState<number>(1);
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;
  return (
    <>
      <h1>Restricted Gear Approvals</h1>
      <p>
        The old{" "}
        <a href={restrictedDocUrl} target="_blank" rel="noreferrer">
          restricted gear doc
        </a>{" "}
        has been deprecated. All current approvals should be on this page.
      </p>
      {nbPages != null && (
        <div className="row">
          {
            <div className="col-sm-auto">
              <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
            </div>
          }

          <div className="col-md d-flex flex-grow-1 justify-content-end">
            {isApprover && (
              <Link to="/add-approval">
                <button className="btn btn-outline-primary mb-3">
                  ＋ Add approval
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
      <div className="form-switch mb-2">
        <Checkbox
          value={showExpired}
          className="me-3"
          onChange={() => setShowExpired((v) => !v)}
        />
        Show expired approvals
      </div>
      {data && (
        <ApprovalsTable approvals={data.results} onDelete={() => refetch()} />
      )}
    </>
  );
}
