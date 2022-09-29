type Props = {
  submitNewRequest: () => void;
};

export function RequestDeskCreditResults({ submitNewRequest }: Props) {
  return (
    <>
      <p className="mb-2 alert alert-success">
        Your credit request have been submitted. You'll hear from the desk
        captain(s) soon. Thank you for volunteering!
      </p>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={submitNewRequest}
        >
          Submit another request
        </button>
      </div>
    </>
  );
}
