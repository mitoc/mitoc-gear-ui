import Badge from "react-bootstrap/Badge";

import type { Person } from "apiClient/people";

import { ExpirableTile } from "./ExpirableTile";
import { FrequentFlyerForm } from "./FrequentFlyerForm";
import { WaiverForm } from "./WaiverForm";
import { MembershipForm } from "./MembershipForm";

type Props = {
  person: Person;
  refreshPerson: () => void;
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
      <ExpirableTile
        title="Membership"
        person={person}
        exp={person.membership}
        AddForm={MembershipForm}
        required
      />
      <ExpirableTile
        title="Waiver"
        person={person}
        exp={person.waiver}
        AddForm={WaiverForm}
        required
      />
      <ExpirableTile
        person={person}
        title="Frequent flyer checks"
        exp={person.frequentFlyerCheck}
        AddForm={FrequentFlyerForm}
      />
      <div>
        <strong>Mitoc credit:</strong> ${person.mitocCredit}
      </div>
    </div>
  );
}
