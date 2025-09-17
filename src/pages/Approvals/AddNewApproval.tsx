import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  createNewApproval,
  CreateNewApprovalArgs,
} from "src/apiClient/approvals";
import { APIError as APIErrorClass } from "src/apiClient/client";
import { APIErrorType } from "src/apiClient/types";
import { useSetPageTitle } from "src/hooks";
import { gearDbApi } from "src/redux/api";

import { AddNewApprovalForm } from "./AddNewApprovalForm";

export default function AddNewApproval() {
  useSetPageTitle("Approve restricted gear rental");
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<APIErrorType | undefined>();
  const refetchAllApprovals = gearDbApi.useLazyGetApprovalsQuery()[0];
  const refetchPersonApprovals = gearDbApi.useLazyGetRenterApprovalsQuery()[0];

  const searchParams = new URLSearchParams(location.search);
  const personId = searchParams.get("personId");

  const onSubmit = (args: CreateNewApprovalArgs) => {
    createNewApproval(args)
      .then(() => {
        setError(undefined);
        // TODO: We should use RTK's mutations instead of refetching everything
        refetchAllApprovals({ past: false });
        refetchAllApprovals({ past: undefined });
        if (personId != null) {
          refetchPersonApprovals({ personID: personId, past: false });
          navigate(`/people/${personId}?tab=approvals`);
        } else {
          navigate("/approvals");
        }
      })
      .catch((err) => {
        if (err instanceof APIErrorClass) {
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
        <AddNewApprovalForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
