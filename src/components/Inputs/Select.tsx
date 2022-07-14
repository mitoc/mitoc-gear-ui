import { InputHTMLAttributes } from "react";

type SelectProps = InputHTMLAttributes<HTMLSelectElement>;

type Props = {
  value?: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
} & Omit<SelectProps, "value" | "onChange" | "className">;

export function Select({
  value,
  onChange,
  options,
  className,
  ...otherProps
}: Props) {
  return (
    <select
      className={className ?? "form-control"}
      onChange={(evt) => {
        onChange(evt.target.value);
      }}
      value={value}
      {...otherProps}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
