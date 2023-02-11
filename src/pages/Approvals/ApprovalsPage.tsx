import { useState } from "react";

import { TablePagination } from "components/TablePagination";
import { useSetPageTitle } from "hooks";
import { useGetApprovalsQuery } from "redux/api";

import { Checkbox } from "components/Inputs/Checkbox";

import { ApprovalsTable } from "./ApprovalsTable";
import { useForm } from "react-hook-form";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { Form } from "components/Inputs/Form";
import { PersonSelect } from "components/PersonSelect";

export function ApprovalsPage() {
  useSetPageTitle("Restricted gear");
  const [showExpired, setShowExpired] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { data } = useGetApprovalsQuery({
    past: showExpired ? undefined : false, // filter past by default, unless opting in
  });
  const [page, setPage] = useState<number>(1);
  const nbPages =
    data?.count != null ? Math.ceil(data?.count / 50) : data?.count;
  return (
    <>
      <h1>Restricted Gear Approvals</h1>
      {showForm && <ApprovalForm onCancel={() => setShowForm(false)} />}
      {nbPages != null && (
        <div className="row">
          {
            <div className="col-sm-auto">
              <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
            </div>
          }

          <div className="col-md d-flex flex-grow-1 justify-content-end">
            {/* <Link to="/add-gear"> */}
            <button
              className="btn btn-outline-primary mb-3"
              onClick={() => setShowForm(true)}
            >
              ＋ Add approval
            </button>
            {/* </Link> */}
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

type FormValues = {};

function ApprovalForm({ onCancel }: { onCancel: () => void }) {
  const formObject = useForm<FormValues>();
  const onSubmit = (args: FormValues) => {};
  return (
    <div className="row">
      <div className="col-lg-8">
        {/* {error && <AddNewPersonError err={error} />} */}
        <hr />
        <h3>New approval</h3>
        <Form onSubmit={onSubmit} form={formObject}>
          <LabeledInput
            title="Renter:"
            name="renter"
            renderComponent={({ value, onChange, onBlur, invalid }: any) => {
              return (
                <PersonSelect
                  // className={`w-100 ${invalid ? "is-invalid" : ""}`}
                  // styles={{
                  //   control: (base, state) =>
                  //     !invalid
                  //       ? base
                  //       : {
                  //           ...base,
                  //           ...invalidFormControlStyle,
                  //         },
                  // }}
                  value={value}
                  onChange={onChange}
                  // onBlur={onBlur}
                />
              );
            }}
            options={{
              required: true,
            }}
          />

          <div className="d-flex justify-content-between mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </Form>
        <hr />
      </div>
    </div>
  );
}
