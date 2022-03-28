import styled from "styled-components";
import Badge from "react-bootstrap/Badge";

import type { Person, Expireable } from "apiClient/people";
import { formatDate } from "lib/fmtDate";

type Props = {
  person: Person;
};

export function PersonProfile({ person }: Props) {
  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h3>
        {person.firstName} {person.lastName}
      </h3>
      <div className="text-sm">{person.affiliation}</div>

      <a href={`mailto:${person.email}`}>{person.email}</a>

      <div>
        {person.groups.map((group) => (
          <Badge key={group.id} className="me-1" bg="secondary">
            {group.groupName}
          </Badge>
        ))}
      </div>
      <ExpireableTile title="Membership" exp={person.membership} required />
      <ExpireableTile title="Waiver" exp={person.waiver} required />
      <ExpireableTile
        title="Frequent flyer checks"
        exp={person.frequentFlyerCheck}
      />
      <div>
        <strong>Mitoc credit:</strong> ${person.mitocCredit}
      </div>
    </div>
  );
}

const ColoredTile = styled.div<{ color?: string }>`
  border: 1px solid #e9ecef;
  border-left-width: 0.25rem;
  border-radius: 0.25rem;
  ${(props) =>
    props.color != null ? `border-left-color: ${props.color};` : ""}
`;

function ExpireableTile({
  title,
  exp,
  required,
}: {
  title: string;
  exp?: Expireable;
  required?: boolean;
}) {
  const today = new Date().toISOString().split("T")[0];
  const isExpired = exp == null || today >= exp.expires;
  const color =
    isExpired && required ? "bs-danger" : isExpired ? "bs-warning" : "bs-teal";
  const colorTxt = `var(--${color})`;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <ColoredTile className="p-2 mb-2 mt-2" color={colorTxt}>
        <strong>{title}</strong>: {children}
      </ColoredTile>
    );
  };

  if (exp == null) {
    return (
      <Wrapper>
        <span style={{ color: colorTxt, fontWeight: "bold" }}>No record</span>
      </Wrapper>
    );
  }

  const prefix = isExpired ? "Expired since" : "Expires on";

  return (
    <Wrapper>
      {prefix}{" "}
      <span style={{ color: colorTxt, fontWeight: "bold" }}>
        {formatDate(exp.expires)}
      </span>
    </Wrapper>
  );
}
