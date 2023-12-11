import { useState } from "react";

import {
  GearSummary,
  markBroken,
  markFixed,
  markFound,
  markMissing,
  markRetired,
  markUnretired,
} from "apiClient/gear";
import { TextArea } from "components/Inputs/TextArea";

export enum GearStatusFormType {
  none,
  broken,
  missing,
  retired,
}

type Props = {
  formType: GearStatusFormType;
  gearItem: GearSummary;
  onChange: () => void;
};

export function GearStatusForm({ formType, gearItem, onChange }: Props) {
  const [newNote, setNewNote] = useState<string>("");
  const notesRequired =
    formType === GearStatusFormType.broken && !gearItem.broken;
  return (
    <form className="mt-2">
      <label className="w-100 mb-2">
        {getLabel(formType, gearItem)}
        <TextArea
          className="w-100"
          value={newNote}
          onChange={setNewNote}
        ></TextArea>
      </label>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={notesRequired && !newNote}
        onClick={(evt) => {
          evt.preventDefault();
          changeStatus(formType, gearItem, newNote)?.then(onChange);
        }}
      >
        Submit
      </button>
    </form>
  );
}

function getLabel(formType: GearStatusFormType, gearItem: GearSummary) {
  if (formType === GearStatusFormType.broken && !gearItem.broken) {
    return "Please describe what is wrong with the gear:";
  } else {
    return "Notes (optional):";
  }
}

function changeStatus(
  formType: GearStatusFormType,
  gearItem: GearSummary,
  note: string,
) {
  if (formType === GearStatusFormType.broken) {
    if (!gearItem.broken) {
      return markBroken(gearItem.id, note);
    } else {
      return markFixed(gearItem.id, note);
    }
  }
  if (formType === GearStatusFormType.missing) {
    if (!gearItem.missing) {
      return markMissing(gearItem.id, note);
    } else {
      return markFound(gearItem.id, note);
    }
  }
  if (formType === GearStatusFormType.retired) {
    if (!gearItem.retired) {
      return markRetired(gearItem.id, note);
    } else {
      return markUnretired(gearItem.id, note);
    }
  }
}
