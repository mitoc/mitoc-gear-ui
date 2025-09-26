import { Link } from "react-router-dom";

import { PersonID } from "src/apiClient/idTypes";

export function AddApprovalLink({ personId }: { personId?: PersonID }) {
  const to =
    personId == null ? "/add-approval" : `/add-approval?personId=${personId}`;
  return (
    <Link to={to}>
      <button className="btn btn-outline-primary mb-3">＋ Add approval</button>
    </Link>
  );
}
