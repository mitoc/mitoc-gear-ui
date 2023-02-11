import ReactSelect, { Props as ReactSelectProps } from "react-select";

type Props<Option> = ReactSelectProps<Option, false> & {
  invalid?: boolean;
};

export function Select<Option = unknown>(props: Props<Option>) {
  return (
    <ReactSelect
      className={`${props.className} ${props.invalid ? "is-invalid" : ""}`}
      styles={{
        control: (base) =>
          !props.invalid
            ? base
            : {
                ...base,
                ...invalidFormControlStyle,
              },
      }}
      {...props}
    />
  );
}

// This is copy-pasted from bootstrap, since we can't set the inner class of React-Select
const invalidFormControlStyle = {
  borderColor: "#dc3545",
  paddingRight: "calc(1.5em + .75rem)",
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right calc(.375em + .1875rem) center",
  backgroundSize: "calc(.75em + .375rem) calc(.75em + .375rem)",
};
