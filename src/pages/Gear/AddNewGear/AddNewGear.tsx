import { isEmpty } from "lodash";
import { useState } from "react";

import { APIError as APIErrorClass } from "apiClient/client";
import { createGear, CreateGearArgs, GearSummary } from "apiClient/gear";
import { APIErrorType } from "apiClient/types";
import { useSetPageTitle } from "hooks";

import { AddNewGearError } from "./AddNewGearError";
import { AddNewGearForm } from "./AddNewGearForm";
import { AddNewGearResults } from "./AddNewGearResults";

export function AddNewGear() {
  useSetPageTitle("Add New Gear");
  const [gearCreated, setGearCreated] = useState<GearSummary[]>([]);
  const [error, setError] = useState<APIErrorType | undefined>();

  const onSubmit = (args: CreateGearArgs) => {
    createGear(args)
      .then(({ items }) => {
        setError(undefined);
        setGearCreated(items);
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
        <h1>Add new gear</h1>
        {error && <AddNewGearError err={error} />}
        {isEmpty(gearCreated) ? (
          <AddNewGearForm onSubmit={onSubmit} />
        ) : (
          <AddNewGearResults
            gearCreated={gearCreated}
            onReset={() => setGearCreated([])}
          />
        )}
      </div>
    </div>
  );
}
