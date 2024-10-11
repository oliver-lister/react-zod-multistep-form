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

export type StepComponentProps<FormData extends FieldValues> = {
  control?: Control<FormData>;
  register?: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
};

export type FormStep<FormData extends FieldValues> = {
  component: React.FC<StepComponentProps<FormData>>;
  fields: Path<FormData>[];
};

type UseMultiStepFormProps<FormData extends FieldValues> = {
  steps: FormStep<FormData>[];
  schema: ZodSchema<FormData>;
  initialValues: DefaultValues<FormData>;
};

export const useMultiStepForm = <FormData extends FieldValues>({
  steps,
  schema,
  initialValues,
}: UseMultiStepFormProps<FormData>) => {
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

  const goToNextStep = useCallback(async () => {
    const isValid = await trigger(steps[currentStepIndex].fields);
    if (!isValid) return;

    setCurrentStepIndex((prevStep) => {
      if (prevStep >= steps.length - 1) return prevStep;
      return prevStep + 1;
    });
  }, [currentStepIndex, steps, trigger]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex((prevStep) => {
      if (prevStep <= 0) return prevStep;
      return prevStep - 1;
    });
  }, []);

  const CurrentStep = steps[currentStepIndex].component;
  const isFirstStep = currentStepIndex <= 0;
  const isLastStep = currentStepIndex >= steps.length - 1;

  return {
    CurrentStep,
    currentStepIndex,
    setCurrentStepIndex,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    handleSubmit,
    control,
    errors,
    register,
  };
};

export default useMultiStepForm;
