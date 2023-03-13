import {
  FormProvider,
  FieldValues,
  UseFormReturn,
  UnpackNestedValue,
} from "react-hook-form";

type Props<FormValues extends FieldValues> = {
  children: React.ReactNode;
  onSubmit: (args: UnpackNestedValue<FormValues>) => void;
  form: UseFormReturn<FormValues>;
};

export function Form<FormValues extends FieldValues>({
  children,
  form,
  onSubmit,
}: Props<FormValues>) {
  const { handleSubmit } = form;
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
