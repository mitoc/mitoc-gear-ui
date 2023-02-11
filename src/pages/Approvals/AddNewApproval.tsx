import { useForm } from "react-hook-form";
import { LabeledInput } from "components/Inputs/LabeledInput";
import { Form } from "components/Inputs/Form";
import { PersonSelect } from "components/PersonSelect";

type FormValues = {};

export function AddNewApproval() {
  const formObject = useForm<FormValues>();
  const onSubmit = (args: FormValues) => {};
  return (
    <div className="row">
      <div className="col-lg-8">
        {/* {error && <AddNewPersonError err={error} />} */}
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
              // onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
