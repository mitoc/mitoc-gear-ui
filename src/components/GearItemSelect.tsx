import { useState } from "react";
import { components, createFilter, OptionProps } from "react-select";

import { GearSummary } from "src/apiClient/gear";
import { useGearList } from "src/redux/api";

import { Select } from "./Select";
import { useDebounce } from "./useDebounce";

export type OptionBadge = {
  text: string;
  variant?: "warning" | "danger" | "info" | "success";
  className?: string;
};

type GearOption = {
  value: string;
  label: string;
  badge?: OptionBadge;
} & GearSummary;

const GearItemOption = (props: OptionProps<GearOption>) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <span>{data.label}</span>
          {data.specification && (
            <div className="opacity-50 small">{data.specification}</div>
          )}
        </div>
        {data.badge && (
          <span
            className={
              data.badge.className ||
              `badge bg-${
                data.badge.variant || "warning"
              } text-dark ms-2 flex-shrink-0`
            }
          >
            {data.badge.text}
          </span>
        )}
      </div>
    </components.Option>
  );
};

const GearItemSingleValue = (props: any) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="d-flex align-items-baseline gap-2">
        <span>{data.label}</span>
        {data.specification && (
          <span className="opacity-50 small">{data.specification}</span>
        )}
      </div>
    </components.SingleValue>
  );
};

type Props = {
  value: string | null;
  onChange: (person: GearSummary | null | undefined) => void;
  className?: string;
  invalid?: boolean;
  filters?: { restricted?: boolean };
  renderBadge?: (gear: GearSummary) => OptionBadge | undefined;
};

export function GearItemSelect({
  className,
  filters,
  invalid,
  onChange,
  value,
  renderBadge,
}: Props) {
  const [query, setInput] = useState<string>("");
  const { pending, fn: debouncedSetInput } = useDebounce(setInput, 250);
  const { gearList, isFetching } = useGearList({
    q: query,
    retired: false,
    ...filters,
  });

  const options: GearOption[] =
    gearList?.map((gear) => {
      const badge = renderBadge?.(gear);
      return {
        value: gear.id,
        label: gear.id,
        ...gear,
        ...(badge && { badge }),
      };
    }) ?? [];

  const selectedOption = options.find((o) => o.value === value);

  return (
    <>
      <Select
        className={className}
        options={options}
        value={selectedOption}
        onChange={onChange}
        onInputChange={debouncedSetInput}
        isLoading={isFetching || pending}
        invalid={invalid}
        filterOption={createFilter({
          stringify: (g) => `${g.label} ${g.data.specification}`,
        })}
        components={{
          Option: GearItemOption,
          SingleValue: GearItemSingleValue,
        }}
      />
    </>
  );
}
