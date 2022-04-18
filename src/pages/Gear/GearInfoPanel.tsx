import { useState } from "react";

import type { GearSummary } from "apiClient/gear";
import { fmtAmount } from "lib/fmtNumber";

import { GearStatus } from "./GearStatus";
import { GearStatusForm, GearStatusFormType } from "./GearStatusForm";
import { GearItemEditForm } from "./GearItemEditForm";

type Props = { gearItem: GearSummary; refreshGear: () => void };

export function GearInfoPanel({ gearItem, refreshGear }: Props) {
  const [formToShow, setFormToShow] = useState<GearStatusFormType>(
    GearStatusFormType.none
  );
  const gearStatusColor =
    gearItem.missing || gearItem.retired || gearItem.broken
      ? "alert-danger"
      : gearItem.checkedOutTo
      ? "alert-info"
      : "";

  // can we reuse these?
  const [isEditing, setEditing] = useState<boolean>(false);

  const onEdit = () => {
    setEditing(true);
  };

  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h4>
        {gearItem.type.typeName} ({gearItem.id})
      </h4>
      <GearStatus
        gearItem={gearItem}
        renderLinks={true}
        className={`p-2 alert ${gearStatusColor}`}
      />
      {gearItem.restricted && (
        <div className="alert alert-warning p-2">
          ⚠️ This item is restricted! Check the{" "}
          <strong>
            <a
              href="https://docs.google.com/spreadsheets/d/1CW3j4K4_HmXlDbO1vPRvIW76SI41EYNbaZKKrqmrgTk/edit?hl=en&hl=en#gid=1019012678"
              target="_blank"
            >
              Restricted gear doc
            </a>
          </strong>
          .
        </div>
      )}

      {!isEditing && (
        <>
          <button
            className="btn btn-outline-secondary"
            style={{ float: "right" }}
            onClick={onEdit}
          >
            Edit
          </button>
          <Field value={gearItem.specification} title="Specification" />
          <Field value={gearItem.description} title="Description" />
          <Field value={gearItem.size} title="Size" />
          <Field value={fmtAmount(gearItem.depositAmount)} title="Deposit" />
        </>
      )}

      {isEditing && (
        <GearItemEditForm
          gearItem={gearItem}
          closeForm={() => setEditing(false)}
          refreshGear={refreshGear}
        />
      )}

      <Field value={fmtAmount(gearItem.dailyFee)} title="Daily Fee" />
      <div className="mt-2">
        <button
          className="btn btn-outline-secondary me-1"
          onClick={() => setFormToShow(GearStatusFormType.broken)}
        >
          {!gearItem.broken ? "Mark broken" : "Mark fixed"}
        </button>
        <button
          className="btn btn-outline-secondary me-1 ms-1"
          onClick={() => setFormToShow(GearStatusFormType.missing)}
        >
          {!gearItem.missing ? "Mark missing" : "Mark found"}
        </button>
        <button
          className="btn btn-outline-secondary ms-1"
          onClick={() => setFormToShow(GearStatusFormType.retired)}
        >
          {!gearItem.retired ? "Mark retired" : "Mark unretired"}
        </button>
      </div>
      {formToShow !== GearStatusFormType.none && (
        <GearStatusForm
          formType={formToShow}
          gearItem={gearItem}
          onChange={() => {
            refreshGear();
            setFormToShow(GearStatusFormType.none);
          }}
        />
      )}
    </div>
  );
}

function Field({ title, value }: { title: string; value?: string }) {
  if (!value) {
    return null;
  }
  return (
    <div className="text-sm">
      <strong>{title}</strong>: {value}
    </div>
  );
}
