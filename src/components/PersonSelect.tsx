import { PersonSummary } from "apiClient/people";
import { countBy, debounce } from "lodash";
import { useMemo, useState } from "react";

import { usePeopleList } from "redux/api";

import { Select } from "./Select";

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

function useDebounce<T extends (...args: any) => any>(fn: T, duration: number) {
  const [pending, setPending] = useState<boolean>(false);
  const debounced = useMemo(
    () =>
      debounce((...args: Parameters<typeof fn>) => {
        setPending(false);
        const result = fn(...args);
        return result;
      }, duration),
    [setPending, fn, duration]
  );
  return {
    pending,
    fn: (...args: Parameters<typeof fn>) => {
      setPending(true);
      return debounced(...args);
    },
  };
}
