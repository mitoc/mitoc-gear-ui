import Badge from "react-bootstrap/Badge";
import Select from "react-select";
import { useState } from "react";

import { Person } from "apiClient/people";
import { useGetGroupsQuery } from "features/api";

type Props = {
  person: Person;
  refreshPerson: () => void;
};
export default function PeopleGroups({ person }: Props) {
  const [showGroupsForm, setShowGroupForms] = useState<boolean>(false);

  const { data: groups } = useGetGroupsQuery();

  const options = groups?.map((g) => ({
    ...g,
    value: g.id,
    label: g.groupName,
  }));

  return (
    <div className="mt-2 d-flex justify-content-between align-items-start">
      {showGroupsForm ? (
        <Select className="flex-grow-1" isMulti={true} options={options} />
      ) : (
        <div>
          {person.groups.map((group) => (
            <Badge key={group.id} className="me-1" bg="secondary">
              {group.groupName}
            </Badge>
          ))}
        </div>
      )}
      <Badge
        as="button"
        className="me-1 ms-3"
        bg="secondary"
        onClick={() => setShowGroupForms((v) => !v)}
      >
        ± Edit groups
      </Badge>
    </div>
  );
}
