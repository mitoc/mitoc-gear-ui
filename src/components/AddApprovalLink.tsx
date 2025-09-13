import { Link } from "react-router-dom";

export function AddApprovalLink({ personId }: { personId?: string }) {
  const to =
    personId == null ? "/add-approval" : `/add-approval?personId=${personId}`;
  return (
    <Link to={to}>
      <button className="btn btn-outline-primary mb-3">＋ Add approval</button>
    </Link>
  );
}
