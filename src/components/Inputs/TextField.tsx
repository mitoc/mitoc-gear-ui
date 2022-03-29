import { debounce } from "lodash";
import { useMemo, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  debounceTime?: number;
  placeholder?: string;
};

export function TextField({
  value,
  onChange,
  debounceTime,
  placeholder,
}: Props) {
  const [localValue, setLocalValue] = useState<string>(value);

  const debouncedOnChange = useMemo(() => {
    if (debounceTime == null) {
      return onChange;
    }
    return debounce(onChange, debounceTime);
  }, [onChange, debounceTime]);

  return (
    <div className="form-group mb-3 w-100">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={localValue}
        onChange={(evt) => {
          const newValue = evt.target.value;
          setLocalValue(newValue);
          debouncedOnChange(newValue);
        }}
      />
    </div>
  );
}
