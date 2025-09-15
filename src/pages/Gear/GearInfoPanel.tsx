import { newApprovalUI } from "src/featureFlags";
import { useState } from "react";
import { Link } from "react-router-dom";

import type { GearSummary } from "src/apiClient/gear";
import { fmtAmount } from "src/lib/fmtNumber";
import { useConfig } from "src/redux/hooks";

import { GearItemEditForm } from "./GearItemEditForm";
import { GearStatus } from "./GearStatus";
import { GearStatusForm, GearStatusFormType } from "./GearStatusForm";

type Props = { gearItem: GearSummary; refreshGear: () => void };

export function GearInfoPanel({ gearItem, refreshGear }: Props) {
  const [formToShow, setFormToShow] = useState<GearStatusFormType>(
    GearStatusFormType.none,
  );
  const { restrictedDocUrl } = useConfig();

  const gearStatusColor =
    gearItem.missing || gearItem.retired || gearItem.broken
      ? "alert-danger"
      : gearItem.checkedOutTo
        ? "alert-info"
        : "";

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
          ⚠️ This item is restricted! See the{" "}
          <strong>
            {newApprovalUI ? (
              <Link to="/approvals">Restricted gear approvals</Link>
            ) : (
              <a href={restrictedDocUrl} target="_blank" rel="noreferrer">
                Restricted gear doc
              </a>
            )}
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
          <Field value={gearItem.location.shorthand} title="Location" />
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
      <div className="mt-2 d-flex gap-2 flex-wrap">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setFormToShow(GearStatusFormType.broken)}
        >
          {!gearItem.broken ? "Mark broken" : "Mark fixed"}
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setFormToShow(GearStatusFormType.missing)}
        >
          {!gearItem.missing ? "Mark missing" : "Mark found"}
        </button>
        <button
          className="btn btn-outline-secondary"
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
