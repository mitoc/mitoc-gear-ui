import { useState } from "react";
import { useGearList } from "redux/api";

import { GearSummary } from "apiClient/gear";

import { Select } from "./Select";
import { useDebounce } from "./useDebounce";

type Props = {
  value: string | null;
  onChange: (person: GearSummary | null) => void;
  className?: string;
  invalid?: boolean;
};

export function GearItemSelect({ value, onChange, className, invalid }: Props) {
  const [query, setInput] = useState<string>("");
  const { pending, fn: debouncedSetInput } = useDebounce(setInput, 250);
  const { gearList, isFetching } = useGearList({
    q: query,
    retired: false,
  });

  const options =
    gearList?.map((gear) => {
      return {
        value: gear.id,
        label: gear.id,
        ...gear,
      };
    }) ?? [];

  const selectedOption = options.find((o) => o.value === value);

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
