import { PersonSummary } from "apiClient/people";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import Select from "react-select";

import { usePeopleList } from "redux/api";

type Props = {
  value: PersonSummary;
  onChange: (person: PersonSummary | null) => void;
};

export function PersonSelect({ value, onChange }: Props) {
  const [query, setInput] = useState<string>("");
  const debouncedSetInput = useMemo(() => debounce(setInput, 250), [setInput]);
  const { personList, isFetching } = usePeopleList({
    q: query,
  });
  const options =
    personList?.map((person) => ({
      value: person.id,
      label: person.firstName + " " + person.lastName,
      ...person,
    })) ?? [];

  return (
    <Select
      className="flex-grow-1"
      options={options}
      value={value}
      onChange={onChange}
      onInputChange={debouncedSetInput}
      isLoading={isFetching}
    />
  );
}
