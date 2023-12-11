import { get } from "lodash";
import { InputHTMLAttributes } from "react";
import {
  useFormContext,
  RegisterOptions,
  Controller,
  FieldValues,
  Path,
  FieldPathValue,
  UnpackNestedValue,
  Noop,
  RefCallBack,
  FieldName,
  DeepMap,
  DeepPartial,
  FieldError,
} from "react-hook-form";
import {
  ErrorMessage,
  FieldValuesFromFieldErrors,
} from "@hookform/error-message";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export type Props<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = InputProps & {
  as?: any;
  renderComponent?: (props: {
    value: UnpackNestedValue<FieldPathValue<TFieldValues, TName>>;
    invalid?: boolean;
    name: TName;
    onChange: (
      value: UnpackNestedValue<FieldPathValue<TFieldValues, TName>>,
    ) => void;
    onBlur: Noop;
    ref: RefCallBack;
  }) => React.ReactElement;
  name: TName;
  title: string;
  options?: RegisterOptions<TFieldValues, TName>;
  inputStyle?: React.CSSProperties;
};

/*
  Important note: this component can only be used inside a FormProvider
  from react-hook-form. It it not compatible with React usual controlled
  components
 */
export function LabeledInput<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>(props: Props<TFieldValues, TName>) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  /* TODO:
    Using the context here causes issue: when we use LabeledInput in a form,
    TS cannot infer the TFieldValues type for LabeledInput
    This could be fixed by:
      - Pass the formObject rather than using context
      - Explicit the generic each type whe use LabeledInput
   */

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
        <Controller<TFieldValues, TName>
          control={control}
          name={name}
          rules={options}
          render={({ field: { onChange, onBlur, value, ref, name } }) => {
            return renderComponent({
              value,
              onBlur,
              onChange,
              ref,
              invalid,
              name,
            });
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
        name={
          name as FieldName<
            FieldValuesFromFieldErrors<
              DeepMap<DeepPartial<TFieldValues>, FieldError>
            >
          >
        }
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

export function makeLabeledInput<TFormValues extends FieldValues>() {
  return function TypedLabeledInput<TName extends Path<TFormValues>>(
    props: Props<TFormValues, TName>,
  ) {
    return LabeledInput(props);
  };
}
