import { useCallback } from "react";
import Select, { MultiValue } from "react-select";

import { PeopleGroup } from "apiClient/people";
import { useGetGroupsQuery } from "redux/api";

type GroupOption = PeopleGroup & {
  value: number;
  label: string;
};

type Props = {
  groups: PeopleGroup[];
  onChange: (groups: PeopleGroup[]) => void;
};

export function GroupSelect({ groups, onChange: onChangeProps }: Props) {
  const { data: allGroups } = useGetGroupsQuery();
  const options = allGroups?.map(makeOption);
  const values = groups.map(makeOption);
  const onChange = useCallback(
    (options: MultiValue<GroupOption>) =>
      onChangeProps(options.map(parseOption)),
    []
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
