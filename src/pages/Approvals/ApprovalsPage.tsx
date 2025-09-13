import { useState } from "react";

import { AddApprovalLink } from "components/AddApprovalLink";
import { Checkbox } from "components/Inputs/Checkbox";
import { TablePagination } from "components/TablePagination";
import { useSetPageTitle } from "hooks";
import { useGetApprovalsQuery } from "redux/api";
import { usePermissions } from "redux/auth";
import { useConfig } from "redux/hooks";

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
            {isApprover && <AddApprovalLink />}
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
