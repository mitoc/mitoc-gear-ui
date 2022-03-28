type Props = {
  value?: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export function Select({ value, onChange, options }: Props) {
  return (
    <select
      className="form-control w-50"
      onChange={(evt) => {
        onChange(evt.target.value);
      }}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          selected={option.value === value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
