import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import {
  Control,
  DefaultValues,
  FieldErrors,
  FieldValues,
  Path,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { ZodSchema } from "zod";

export type FormStepComponentProps<FormData extends FieldValues> = {
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
};

export type FormStepComponent<FormData extends FieldValues> = React.FC<
  FormStepComponentProps<FormData>
>;

export type FormStep<FormData extends FieldValues> = {
  component: FormStepComponent<FormData>;
  fields: Path<FormData>[];
};

export const useMultiStepForm = <FormData extends FieldValues>({
  steps,
  schema,
  initialValues,
}: {
  steps: FormStep<FormData>[];
  schema: ZodSchema<FormData>;
  initialValues: DefaultValues<FormData>;
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const {
    handleSubmit,
    control,
    trigger,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const next = useCallback(async () => {
    const isValid = await trigger(steps[currentStepIndex].fields);
    if (!isValid) return;

    setCurrentStepIndex((prevStep) => {
      if (prevStep >= steps.length - 1) return prevStep;
      return prevStep + 1;
    });
  }, [currentStepIndex, steps, trigger]);

  const back = useCallback(() => {
    setCurrentStepIndex((prevStep) => {
      if (prevStep <= 0) return prevStep;
      return prevStep - 1;
    });
  }, []);

  const CurrentStepComponent = steps[currentStepIndex].component;
  const isFirstStep = currentStepIndex <= 0;
  const isLastStep = currentStepIndex >= steps.length - 1;

  return {
    CurrentStepComponent,
    currentStepIndex,
    setCurrentStepIndex,
    next,
    back,
    isFirstStep,
    isLastStep,
    handleSubmit,
    control,
    errors,
    register,
  };
};

export default useMultiStepForm;
