import { get } from "lodash";
import { InputHTMLAttributes } from "react";
import {
  useFormContext,
  RegisterOptions,
  Controller,
  FieldValues,
  ControllerRenderProps,
  Path,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

/*
  Important note: this component can only be used inside a FormProvider
  from react-hook-form. It it not compatible with React usual controlled
  components
 */
export function LabeledInput<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  props: InputProps & {
    as?: any;
    renderComponent?: (
      props: ControllerRenderProps<TFieldValues, TName> & { invalid?: boolean }
    ) => React.ReactElement;
    name: TName;
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
            // TODO
            // @ts-expect-error
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
      <ErrorMessage
        errors={errors}
        // TODO
        // @ts-expect-error
        name={name}
        render={({ message }) => {
          const isRequiredError = get(errors, name).type === "required";
          const errorMsg =
            message || (isRequiredError ? "This field is required" : "");
          return <div className="invalid-feedback">{errorMsg}</div>;
        }}
      />
    </label>
  );
}
