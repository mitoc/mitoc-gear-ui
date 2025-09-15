import { isEmpty, map } from "lodash";
import { useState } from "react";

import { PeopleGroup, Person, updatePersonGroups } from "src/apiClient/people";
import { GroupSelect } from "src/components/GroupSelect";
import { useCurrentUser, usePermissions } from "src/redux/auth";

type Props = {
  person: Person;
  refreshPerson: () => void;
};

export default function PeopleGroups({ person, refreshPerson }: Props) {
  const [showGroupsForm, setShowGroupForms] = useState<boolean>(false);
  const { user } = useCurrentUser();
  const { isOfficer } = usePermissions();
  const isMyProfile = person.id === user?.id;

  const noGroups = isEmpty(person.groups);

  const containerClassName = [
    "mt-2",
    ...(noGroups ? ["d-flex", "justify-content-end"] : []),
  ].join(" ");

  if (!showGroupsForm) {
    return (
      <div className={containerClassName}>
        {(isOfficer || isMyProfile) && (
          <button
            className="mt-1 badge bg-secondary"
            onClick={() => setShowGroupForms((v) => !v)}
            style={{
              float: noGroups ? undefined : "right",
              border: "none",
            }}
          >
            {noGroups ? "+ Add groups" : "± Edit groups"}
          </button>
        )}
        <div>
          {person.groups.map((group) => (
            <span key={group.id} className="me-1 badge bg-secondary">
              {group.groupName}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <PeopleGroupsForm
      isOfficer={isOfficer}
      person={person}
      refreshPerson={refreshPerson}
      closeForm={() => setShowGroupForms(false)}
    />
  );
}

function PeopleGroupsForm({
  person,
  refreshPerson,
  closeForm,
  isOfficer,
}: Props & { isOfficer?: boolean; closeForm: () => void }) {
  const [groups, setGroups] = useState<readonly PeopleGroup[]>(person.groups);

  const onSubmit = () =>
    updatePersonGroups(
      person.id,
      groups.map((g) => g.id),
    ).then(() => {
      refreshPerson();
      closeForm();
    });

  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between mb-2">
        <label>New groups:</label>
        <button
          className="mt-1 badge bg-secondary"
          onClick={closeForm}
          style={{ border: "none" }}
        >
          {isEmpty(person.groups) ? "+ Add groups" : "± Edit groups"}
        </button>
      </div>
      <GroupSelect
        groupIds={map(groups, "id")}
        onChange={setGroups}
        editableGroups={isOfficer ? undefined : ["Office Access"]}
      />

      <div className="ms-3 d-flex justify-content-end">
        <button className="btn btn-primary mt-3" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
