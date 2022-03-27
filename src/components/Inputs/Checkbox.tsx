type Props = {
  value?: boolean;
  onChange: (value: boolean) => void;
};

export function Checkbox({ value, onChange }: Props) {
  return (
    <input
      type="checkbox"
      className="form-check-input"
      checked={value}
      onChange={(evt) => {
        onChange(evt.target.checked);
      }}
    />
  );
}
