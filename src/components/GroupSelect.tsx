import { useCallback } from "react";
import Select, { MultiValue } from "react-select";

import { PeopleGroup } from "apiClient/people";
import { useGetGroupsQuery } from "redux/api";

type GroupOption = PeopleGroup & {
  value: number;
  label: string;
};

type Props = {
  groupIds: number[];
  onChange: (groups: PeopleGroup[]) => void;
  editableGroups?: string[]; // if unspecified, allow to edit all groups
};

export function GroupSelect({
  groupIds,
  onChange: onChangeProps,
  editableGroups,
}: Props) {
  const { data: allGroups } = useGetGroupsQuery();
  const allOptions = allGroups?.map(makeOption);
  const options =
    editableGroups == null
      ? allOptions
      : allOptions?.filter(({ groupName }) =>
          editableGroups.includes(groupName),
        );

  const values =
    allOptions == null
      ? null
      : (groupIds
          .map((groupdId) => allOptions.find((opt) => opt.id === groupdId))
          .filter((opt) => opt != null) as GroupOption[]);

  const onChange = useCallback(
    (rawNewValues: MultiValue<GroupOption>) => {
      const newValues = getNewValues(
        values ?? [],
        rawNewValues,
        editableGroups,
      );
      return onChangeProps(newValues.map(parseOption));
    },
    [values, editableGroups, onChangeProps],
  );

  return (
    <Select
      className="flex-grow-1"
      isMulti={true}
      options={options}
      value={values}
      onChange={onChange}
    />
  );
}

function makeOption(g: PeopleGroup): GroupOption {
  return {
    ...g,
    value: g.id,
    label: g.groupName,
  };
}

function parseOption(o: GroupOption): PeopleGroup {
  const { value, label, ...other } = o;
  return other;
}

function getNewValues(
  currentValues: GroupOption[],
  newValues: MultiValue<GroupOption>,
  editableGroups?: string[],
) {
  if (!editableGroups) {
    // No restriction on what group is editable, just pass the values through
    return newValues;
  }
  const currentValuesIds = new Set(currentValues.map(({ id }) => id));
  const newValuesIds = new Set(newValues.map(({ id }) => id));
  const addedValues = newValues.filter(({ id }) => !currentValuesIds.has(id));
  return [
    ...currentValues.filter(
      ({ groupName, id }) =>
        newValuesIds.has(id) || // the group is still included in the new values, keep it
        !editableGroups?.includes(groupName), // the group is not editable, keep it
    ),
    ...addedValues,
  ];
}
