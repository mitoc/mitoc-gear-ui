import { PersonSummary } from "apiClient/people";
import { countBy } from "lodash";
import { useState } from "react";

import { usePeopleList } from "redux/api";

import { Select } from "./Select";
import { useDebounce } from "./useDebounce";

type Props = {
  value: PersonSummary;
  onChange: (person: PersonSummary | null) => void;
  className?: string;
  invalid?: boolean;
};

export function PersonSelect({ value, onChange, className, invalid }: Props) {
  const [query, setInput] = useState<string>("");
  const { pending, fn: debouncedSetInput } = useDebounce(setInput, 250);
  const { personList, isFetching } = usePeopleList({
    q: query,
  });

  const getName = (person: PersonSummary) =>
    `${person.firstName} ${person.lastName}`;

  const namesCount = countBy(personList, getName);

  const options =
    personList?.map((person) => {
      const name = getName(person);
      const fullName =
        namesCount[name] > 1 ? `${name} (${person.email})` : name;
      return {
        value: person.id,
        label: fullName,
        ...person,
      };
    }) ?? [];

  return (
    <Select
      className={className}
      options={options}
      value={value}
      onChange={onChange}
      onInputChange={debouncedSetInput}
      isLoading={isFetching || pending}
      invalid={invalid}
    />
  );
}
