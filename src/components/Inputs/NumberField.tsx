import styled from "styled-components";

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
  integer?: boolean;
};

export function NumberField({ value, onChange, integer }: Props) {
  return (
    <SmallNumberInput
      type="number"
      className="form-control sm"
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
    ></SmallNumberInput>
  );
}

const ArrowLessNumberInput = styled.input`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const SmallNumberInput = styled(ArrowLessNumberInput)`
  width: 2.5rem;
  display: inline;
  padding: 0.2rem;
  height: 1.5rem;
`;
