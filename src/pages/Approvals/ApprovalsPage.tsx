import { useState } from "react";

import { TablePagination } from "components/TablePagination";
import { useSetPageTitle } from "hooks";
import { useGetApprovalsQuery } from "redux/api";

import { Checkbox } from "components/Inputs/Checkbox";

import { ApprovalsTable } from "./ApprovalsTable";
import { Link } from "react-router-dom";
import { usePermissions } from "redux/auth";

export function ApprovalsPage() {
  useSetPageTitle("Restricted gear");
  const { isApprover } = usePermissions();
  const [showExpired, setShowExpired] = useState<boolean>(false);
  const { data } = useGetApprovalsQuery({
    past: showExpired ? undefined : false, // filter past by default, unless opting in
  });
  const [page, setPage] = useState<number>(1);
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;
  return (
    <>
      <h1>Restricted Gear Approvals</h1>
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
      {data && <ApprovalsTable approvals={data.results} />}
    </>
  );
}
