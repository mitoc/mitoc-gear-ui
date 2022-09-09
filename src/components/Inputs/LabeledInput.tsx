import { get } from "lodash";
import { InputHTMLAttributes } from "react";
import {
  Path,
  useFormContext,
  RegisterOptions,
  Controller,
} from "react-hook-form";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

/*
  Important note: this component can only be used inside a FormProvider
  from react-hook-form. It it not compatible with React usual controlled
  components
 */
export function LabeledInput<TFieldValues>(
  props: InputProps & {
    as?: any;
    renderComponent?: (arg: any) => React.ReactElement;
    name: Path<TFieldValues>;
    title: string;
    options?: RegisterOptions<TFieldValues>;
    inputStyle?: React.CSSProperties;
  }
) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  const { name } = props;
  const {
    as: Component = "input",
    title,
    options,
    className,
    renderComponent,
    inputStyle,
    ...otherProps
  } = props;

  const error = get(errors, name);
  const errorMsg =
    error?.message ||
    (error?.type === "required" ? "This field is required" : undefined);
  const invalid = error != null;
  const isCheckBox = otherProps.type === "checkbox";
  const inputClassNames = [
    isCheckBox ? "form-check-input" : "form-control",
    invalid ? "is-invalid" : "",
  ];
  const labelClassNames = ["w-100", "mb-2", className];

  return (
    <label className={labelClassNames.join(" ")}>
      {!isCheckBox && title}
      {renderComponent != null ? (
        <Controller
          control={control}
          name={name}
          rules={options}
          render={({ field: { onChange, onBlur, value, ref } }) => {
            return renderComponent({ value, onBlur, onChange, ref, invalid });
          }}
        />
      ) : (
        <Component
          className={inputClassNames.join(" ")}
          style={inputStyle}
          {...otherProps}
          {...register(name, options)}
        />
      )}

      {isCheckBox && <span className="ps-2">{title}</span>}
      <div className="invalid-feedback">{errorMsg}</div>
    </label>
  );
}
