import { skipToken } from "@reduxjs/toolkit/query";
import { countBy } from "lodash";
import { useState } from "react";

import { PersonID } from "src/apiClient/idTypes";
import { PersonSummary } from "src/apiClient/people";
import { useGetPersonQuery, usePeopleList } from "src/redux/api";

import { Select } from "./Select";
import { useDebounce } from "./useDebounce";

type Props = {
  value: PersonID | undefined;
  onChange: (person: PersonSummary | null | undefined) => void;
  className?: string;
  invalid?: boolean;
};

export function PersonSelect({ value, onChange, className, invalid }: Props) {
  const [query, setInput] = useState<string>("");
  const { pending, fn: debouncedSetInput } = useDebounce(setInput, 250);
  const { personList, isFetching } = usePeopleList({
    q: query,
  });
  const { data: selectedPerson } = useGetPersonQuery(value ?? skipToken, {
    skip: value == null,
  });

  const getName = (person: PersonSummary) =>
    `${person.firstName} ${person.lastName}`;

  const namesCount = countBy(personList, getName);

  const listWithSelection =
    personList == null
      ? []
      : selectedPerson == null
        ? personList
        : personList.some((p) => p.id === value)
          ? personList
          : [...personList, selectedPerson];

  const options =
    listWithSelection?.map((person) => {
      const name = getName(person);
      const fullName =
        namesCount[name] > 1 ? `${name} (${person.email})` : name;
      return {
        value: person.id,
        label: fullName,
        ...person,
      };
    }) ?? [];

  // We want == rather than ===, there is some type mess here
  const selectedOption = options.find((o) => o.id == value);

  return (
    <Select
      className={className}
      options={options}
      value={selectedOption}
      onChange={onChange}
      onInputChange={debouncedSetInput}
      isLoading={isFetching || pending}
      invalid={invalid}
    />
  );
}
