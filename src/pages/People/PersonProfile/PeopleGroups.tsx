import Badge from "react-bootstrap/Badge";
import Select from "react-select";
import { useState } from "react";

import { PeopleGroup, Person, updatePersonGroups } from "apiClient/people";
import { useGetGroupsQuery } from "features/api";
import { usePermissions } from "features/auth";

type Props = {
  person: Person;
  refreshPerson: () => void;
};

type GroupOption = PeopleGroup & {
  value: number;
  label: string;
};

export default function PeopleGroups({ person, refreshPerson }: Props) {
  const [showGroupsForm, setShowGroupForms] = useState<boolean>(false);
  const { isOfficer } = usePermissions();

  if (!showGroupsForm) {
    return (
      <div className="mt-2 d-flex justify-content-between">
        <div>
          {person.groups.map((group) => (
            <Badge key={group.id} className="me-1" bg="secondary">
              {group.groupName}
            </Badge>
          ))}
        </div>
        {isOfficer && (
          <div className="ms-3 d-flex flex-column justify-content-between">
            <Badge
              as="button"
              bg="secondary"
              onClick={() => setShowGroupForms((v) => !v)}
            >
              ± Edit groups
            </Badge>
          </div>
        )}
      </div>
    );
  }

  return (
    <PeopleGroupsForm
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
}: Props & { closeForm: () => void }) {
  const initialValues = person.groups.map(makeOption);
  const [personGroups, setGroups] = useState<readonly GroupOption[]>(
    initialValues
  );

  const { data: allGroups } = useGetGroupsQuery();

  const onSubmit = () =>
    updatePersonGroups(
      person.id,
      personGroups.map((g) => g.id)
    ).then(() => {
      refreshPerson();
      closeForm();
    });

  const options = allGroups?.map(makeOption);
  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between mb-2">
        <label>New groups:</label>
        <Badge as="button" bg="secondary" onClick={closeForm}>
          ± Edit groups
        </Badge>
      </div>
      <Select
        className="flex-grow-1"
        isMulti={true}
        options={options}
        value={personGroups}
        onChange={setGroups}
      />
      <div className="ms-3 d-flex justify-content-end">
        <button className="btn btn-primary mt-3" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

function makeOption(g: PeopleGroup): GroupOption {
  return {
    ...g,
    value: g.id,
    label: g.groupName,
  };
}
