import { useState } from "react";

import { APIErrorType } from "apiClient/types";
import { useSetPageTitle } from "hooks";
import { createNewApproval, CreateNewApprovalArgs } from "apiClient/approvals";
import { APIError as APIErrorClass } from "apiClient/client";
import { gearDbApi } from "redux/api";

import { AddNewApprovalForm } from "./AddNewApprovalForm";
import { Link } from "react-router-dom";
import { useAppDispatch } from "redux/hooks";

export function AddNewApproval() {
  useSetPageTitle("Approve restricted gear rental");
  const dispatch = useAppDispatch();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<APIErrorType | undefined>();

  const onSubmit = (args: CreateNewApprovalArgs) => {
    createNewApproval(args)
      .then(({ items }) => {
        setError(undefined);
        setSuccess(true);
        // TODO: We should use RTK's mutations instead
        dispatch(gearDbApi.endpoints.getApprovals.initiate({ past: false }));
      })
      .catch((err) => {
        if (err instanceof APIErrorClass) {
          setSuccess(false);
          setError(err.error);
        }
        throw err;
      });
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <h3>Approve restricted gear rental</h3>
        {error && (
          <div className="alert alert-danger">Approval failed: {error.msg}</div>
        )}
        {!success && <AddNewApprovalForm onSubmit={onSubmit} />}
        {success && (
          <>
            <p className="mb-2 alert alert-success">
              Success! The approval was granted:
            </p>

            <div className="d-flex justify-content-between">
              <Link to="/approvals">
                <button type="button" className="btn btn-outline-secondary">
                  Go to approvals list
                </button>
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSuccess(false)}
              >
                Approve another rental
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
