import { InputHTMLAttributes } from "react";
import { FieldPath, useFormContext, RegisterOptions } from "react-hook-form";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

/*
  Important note: this component can only be used inside a FormProvider
  from react-hook-form. It it not compatible with React usual controlled
  components
 */
export function LabeledInput<TFieldValues>(
  props: InputProps & {
    as?: any;
    name: FieldPath<TFieldValues>;
    title: string;
    options?: RegisterOptions<TFieldValues>;
  }
) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const {
    as: Component = "input",
    title,
    options,
    className,
    ...otherProps
  } = props;

  const name = otherProps.name;
  const error = errors[name];
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
    <>
      <label className={labelClassNames.join(" ")}>
        {!isCheckBox && title}
        <Component
          className={inputClassNames.join(" ")}
          {...otherProps}
          {...register(name, options)}
        />
        {isCheckBox && <span className="ps-2">{title}</span>}
        <div className="invalid-feedback">{errorMsg}</div>
      </label>
    </>
  );
}
