import styled from "styled-components";

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
  integer?: boolean;
  className?: string;
  small?: boolean;
};

export function NumberField({
  value,
  onChange,
  integer,
  small,
  className,
}: Props) {
  const Component = small
    ? SmallNumberInput
    : integer
      ? InputWithArrows
      : ArrowLessInput;
  const actualClassName = `form-control ${className ?? ""} ${small && "sm"}`;
  return (
    <Component
      type="number"
      className={actualClassName}
      value={value ?? ""}
      onChange={(evt) => {
        const rawValue = evt.target.value;
        if (rawValue === "") {
          return onChange(null);
        }
        const valueAsNumber = Number(rawValue);
        const value = integer ? Math.round(valueAsNumber) : valueAsNumber;
        onChange(value);
      }}
    />
  );
}

const InputWithArrows = styled.input``;

const ArrowLessInput = styled.input`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const SmallNumberInput = styled(ArrowLessInput)`
  width: 2.5rem;
  display: inline;
  padding: 0.2rem;
  height: 1.5rem;
`;
