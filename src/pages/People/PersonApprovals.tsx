import { useGetRenterApprovalsQuery } from "redux/api";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";

export function PersonApprovals() {
  const { person } = usePersonPageContext();
  const { data: approvals } = useGetRenterApprovalsQuery({
    personID: person.id,
  });
  return (
    <div className="border rounded-2 p-2 bg-light">
      <h3>Approvals</h3>
      <table className="table">
        <tbody>
          {approvals?.results.map((approval) => {
            // const { id, type, checkedout, weeksOut, totalAmount } = rental;
            return <pre key={approval.id}>{JSON.stringify(approval)}</pre>;
          })}
        </tbody>
      </table>
    </div>
  );
}
