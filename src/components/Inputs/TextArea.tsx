type Props = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};

export function TextArea({ value, onChange, className }: Props) {
  return (
    <textarea
      className={className}
      onChange={(evt) => onChange(evt.target.value)}
      value={value}
    />
  );
}
