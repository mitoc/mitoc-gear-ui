import { Person } from "apiClient/people";
import { ToggleExpandButton } from "components/Buttons";

import { ColoredTile, ExpirableTile } from "./ExpirableTile";
import { FrequentFlyerForm } from "./FrequentFlyerForm";
import { WaiverForm } from "./WaiverForm";
import { MembershipForm } from "./MembershipForm";
import { useState } from "react";
import { PersonEditForm } from "./PersonEditForm";
import { MitocCreditForm } from "./MitocCreditForm";
import { usePermissions } from "redux/auth";

import PeopleGroups from "./PeopleGroups";
import styled from "styled-components";

type Props = {
  person: Person;
  refreshPerson: () => void;
};

export function PersonProfile({ person, refreshPerson }: Props) {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [showDeskCreditForm, setShowDeskCreditForm] = useState<boolean>(false);
  const { isOfficer } = usePermissions();

  const onEdit = () => {
    setEditing(true);
  };

  return (
    <StyledDiv className="border rounded-2 p-2 mb-3 bg-light">
      {!isEditing && (
        <>
          <button
            className="btn btn-outline-secondary"
            style={{ float: "right" }}
            onClick={onEdit}
          >
            Edit
          </button>
          <h3>
            {person.firstName} {person.lastName}
          </h3>
          <div className="text-sm">{person.affiliation}</div>
          <div>
            <a href={`mailto:${person.email}`}>{person.email}</a>
          </div>
          {person.alternateEmails.map((altEmail) => {
            return (
              <div>
                <DiscreetLink href={`mailto:${altEmail}`}>
                  {altEmail}
                </DiscreetLink>
              </div>
            );
          })}
        </>
      )}

      {isEditing && (
        <PersonEditForm
          person={person}
          closeForm={() => setEditing(false)}
          refreshPerson={refreshPerson}
        />
      )}

      <PeopleGroups person={person} refreshPerson={refreshPerson} />
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
      <ColoredTile className="p-2 mb-2 mt-2">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>Mitoc credit:</strong> ${person.mitocCredit}
          </div>
          {isOfficer && (
            <ToggleExpandButton
              onClick={() => setShowDeskCreditForm((current) => !current)}
              isOpen={showDeskCreditForm}
            />
          )}
        </div>

        {showDeskCreditForm && (
          <MitocCreditForm
            person={person}
            onClose={() => setShowDeskCreditForm(false)}
          />
        )}
      </ColoredTile>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  input,
  select {
    width: 250px;
    max-width: 100%;
  }
`;

const DiscreetLink = styled.a`
  color: #6c757d;
`;
