import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function TextField({ value, onChange, placeholder, className }: Props) {
  return (
    <div className={className ?? "w-100"}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(evt) => {
          const newValue = evt.target.value;
          onChange(newValue);
        }}
      />
    </div>
  );
}

type SearchTextFieldProps = Props & { debounceTime: number };

export function SearchTextField(props: SearchTextFieldProps) {
  const { value, debounceTime, onChange, ...otherProps } = props;
  const [localValue, setLocalValue] = useState<string>(value);

  const debouncedOnChange = useMemo(() => {
    if (debounceTime == null) {
      return onChange;
    }
    return debounce(onChange, debounceTime);
  }, [onChange, debounceTime]);

  return (
    <TextField
      value={localValue}
      onChange={(newValue) => {
        setLocalValue(newValue);
        debouncedOnChange(newValue);
      }}
      {...otherProps}
    />
  );
}
