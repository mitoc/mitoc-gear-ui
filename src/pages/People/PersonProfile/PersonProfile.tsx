import { useState } from "react";
import styled from "styled-components";

import { ToggleExpandButton } from "src/components/Buttons";
import { usePermissions } from "src/redux/auth";

import { usePersonPageContext } from "../PeoplePage/PersonPageContext";

import { ColoredTile, ExpirableTile } from "./ExpirableTile";
import { FrequentFlyerForm } from "./FrequentFlyerForm";
import { MembershipForm } from "./MembershipForm";
import { MitocCreditForm } from "./MitocCreditForm";
import PeopleGroups from "./PeopleGroups";
import { PersonEditForm } from "./PersonEditForm";
import { WaiverForm } from "./WaiverForm";

export function PersonProfile() {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [showDeskCreditForm, setShowDeskCreditForm] = useState<boolean>(false);
  const { isDeskManager } = usePermissions();

  const onEdit = () => {
    setEditing(true);
  };

  const { person } = usePersonPageContext();

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
              <div key={altEmail}>
                <DiscreetLink href={`mailto:${altEmail}`}>
                  {altEmail}
                </DiscreetLink>
              </div>
            );
          })}
        </>
      )}

      {isEditing && (
        <PersonEditForm person={person} closeForm={() => setEditing(false)} />
      )}

      <PeopleGroups person={person} />
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
          {isDeskManager && (
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
