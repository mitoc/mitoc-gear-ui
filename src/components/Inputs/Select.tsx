type Props = {
  value?: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export function Select({ value, onChange, options }: Props) {
  return (
    <select
      className="form-control"
      onChange={(evt) => {
        onChange(evt.target.value);
      }}
      value={value}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
