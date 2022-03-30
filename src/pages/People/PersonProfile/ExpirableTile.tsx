import { useState } from "react";
import styled from "styled-components";

import { formatDate } from "lib/fmtDate";

import type { Expireable, Person } from "apiClient/people";
import { ToggleExpandButton } from "components/Buttons";

export function ExpirableTile({
  title,
  exp,
  required,
  AddForm,
  person,
}: {
  title: string;
  exp?: Expireable;
  required?: boolean;
  AddForm?: (props: any) => JSX.Element;
  person: Person;
}) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const today = new Date().toISOString().split("T")[0];
  const isExpired = exp == null || today >= exp.expires;
  const prefix = isExpired ? "Expired since" : "Expires on";
  const color =
    isExpired && required ? "bs-danger" : isExpired ? "bs-warning" : "bs-teal";
  const colorTxt = `var(--${color})`;

  return (
    <ColoredTile className={`p-2 mb-2 mt-2`} color={colorTxt}>
      <div className="d-flex flex-row justify-content-between">
        <div>
          <strong>{title}</strong>: {exp != null && prefix + " "}
          <span style={{ color: colorTxt, fontWeight: "bold" }}>
            {exp == null ? "No record" : formatDate(exp.expires)}
          </span>
        </div>
        <ToggleExpandButton
          onClick={() => setShowForm((current) => !current)}
          isOpen={showForm}
        />
      </div>
      {showForm && AddForm && (
        <AddForm person={person} onClose={() => setShowForm(false)} />
      )}
    </ColoredTile>
  );
}

const ColoredTile = styled.div<{ color?: string }>`
  border: 1px solid #e9ecef;
  border-left-width: 0.25rem;
  border-radius: 0.25rem;
  ${(props) =>
    props.color != null ? `border-left-color: ${props.color};` : ""}
`;
