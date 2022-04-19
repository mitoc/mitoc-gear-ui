import { debounce } from "lodash";
import { useMemo, useState, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

type Props = {
  value: string;
  onChange: (value: string) => void;
} & Omit<InputProps, "value" | "onChange">;

export function TextField({
  value,
  onChange,
  placeholder,
  className,
  ...otherProps
}: Props) {
  const inputClassName = ["form-control", className ?? "w-100"].join(" ");
  return (
    <input
      type="text"
      className={inputClassName}
      value={value}
      onChange={(evt) => {
        const newValue = evt.target.value;
        onChange(newValue);
      }}
      {...otherProps}
    />
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
