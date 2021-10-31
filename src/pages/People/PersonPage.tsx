import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Badge from "react-bootstrap/Badge";

import { peopleClient, Person, Expireable } from "apiClient/people";

export function PersonPage() {
  const [person, setPerson] = useState<Person | null>(null);
  const { personId } = useParams<{ personId: string }>();
  useEffect(() => {
    peopleClient.getPerson(personId).then((person) => setPerson(person));
  }, [personId]);
  if (person == null) {
    return null;
  }
  return (
    <div className="row">
      <div className="col-5 p-2">
        <div className="border rounded-2 p-2 bg-light">
          <h3>
            {person.firstName} {person.lastName}
          </h3>
          <div className="text-sm">{person.affiliation}</div>

          <a href={`mailto:${person.email}`}>{person.email}</a>

          <div>
            {person.groups.map((group) => (
              <Badge className="me-1" bg="secondary">
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
        </div>
      </div>
      <div className="col-7 p-2">
        <div className="border rounded-2 p-2 bg-light">
          {JSON.stringify(person)}
        </div>
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
  exp: Expireable;
  required?: boolean;
}) {
  const expDate = exp?.expires;
  const today = new Date().toISOString().split("T")[0];
  const isExpired = exp == null || today >= expDate;
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
  const fmtDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Wrapper>
      {prefix}{" "}
      <span style={{ color: colorTxt, fontWeight: "bold" }}>
        {fmtDate(expDate)}
      </span>
    </Wrapper>
  );
}
