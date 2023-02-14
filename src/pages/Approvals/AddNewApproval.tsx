import { useSetPageTitle } from "hooks";

import { AddNewApprovalForm } from "./AddNewApprovalForm";

export function AddNewApproval() {
  useSetPageTitle("Approve restricted gear rental");
  // const [gearCreated, setGearCreated] = useState<GearSummary[]>([]);
  // const [error, setError] = useState<APIErrorType | undefined>();

  // const onSubmit = (args: CreateGearArgs) => {
  //   createGear(args)
  //     .then(({ items }) => {
  //       setError(undefined);
  //       setGearCreated(items);
  //     })
  //     .catch((err) => {
  //       if (err instanceof APIErrorClass) {
  //         setError(err.error);
  //       }
  //       throw err;
  //     });
  // };

  return (
    <div className="row">
      <div className="col-lg-8">
        <h3>Approve restricted gear rental</h3>
        <AddNewApprovalForm />
      </div>
    </div>
  );

  // return (
  //   <div className="row">
  //     <div className="col-lg-8">
  //       <h1>Add new gear</h1>
  //       {error && <AddNewGearError err={error} />}
  //       {isEmpty(gearCreated) ? (
  //         <AddNewGearForm onSubmit={onSubmit} />
  //       ) : (
  //         <AddNewGearResults
  //           gearCreated={gearCreated}
  //           onReset={() => setGearCreated([])}
  //         />
  //       )}
  //     </div>
  //   </div>
  // );
}
