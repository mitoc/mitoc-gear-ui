import { APIErrorType } from "apiClient/types";

export function AddNewPersonError({ err }: { err: APIErrorType }) {
  return (
    <div className="alert alert-danger">Person creation failed: {err.msg}</div>
  );
}
