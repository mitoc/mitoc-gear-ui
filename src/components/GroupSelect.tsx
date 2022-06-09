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
};

export function GroupSelect({ groupIds, onChange: onChangeProps }: Props) {
  const { data: allGroups } = useGetGroupsQuery();
  const options = allGroups?.map(makeOption);
  const values =
    options == null
      ? null
      : (groupIds
          .map((groupdId) => options.find((opt) => opt.id === groupdId))
          .filter((opt) => opt != null) as GroupOption[]);

  const onChange = useCallback(
    (options: MultiValue<GroupOption>) =>
      onChangeProps(options.map(parseOption)),
    [onChangeProps]
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
