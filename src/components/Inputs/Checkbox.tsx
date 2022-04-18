type Props = {
  value?: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

export function Checkbox({
  value,
  onChange,
  className: classNameOverride,
}: Props) {
  const className = [classNameOverride ?? "", "form-check-input"].join(" ");
  return (
    <input
      type="checkbox"
      className={className}
      checked={value}
      onChange={(evt) => {
        onChange(evt.target.checked);
      }}
    />
  );
}
