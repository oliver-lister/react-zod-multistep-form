# React Zod Multi-Step Form Hook

`react-zod-multistep-form` is a lightweight React hook designed to simplify the
management of multi-step forms. It integrates `react-hook-form` with `Zod`
schema validation to handle form state, validation, and error management across
multiple steps. This hook provides a seamless way to navigate between form steps
while maintaining robust validation and form control.

## Features

- **Multi-step form management**: Easily navigate through multiple form steps
  with built-in state management.
- **Zod schema validation**: Integrates `Zod` for schema-based validation at
  each step to ensure type safety.
- **React Hook Form integration**: Leverages `react-hook-form` to handle form
  state, registration, and validation.
- **Error handling**: Provides detailed error management for each form step,
  ensuring validation is respected.
- **Navigation callbacks**: Simple `goToNextStep` and `goToPreviousStep`
  functions to handle form step transitions while respecting validation.

## Installation

```bash
npm install react-zod-multistep-form
```

## Usage

Here’s how to use the `useMultiStepForm` hook in your application:

### Step 1: Define your form schema using Zod

```tsx
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.number().min(18, "Must be at least 18"),
});

type FormData = z.infer<typeof schema>;
```

### Step 2: Create form step components

```tsx
import { FormStepComponent } from "@oliver-lister/react-zod-multistep-form";

const NameStep: FormStepComponent<FormData> = ({ register, errors }) => (
  <div>
    <label>Name</label>
    <input {...register("name")} />
    {errors.name && <p>{errors.name.message}</p>}
  </div>
);

const AgeStep: FormStepComponent<FormData> = ({ register, errors }) => (
  <div>
    <label>Age</label>
    <input type="number" {...register("age")} />
    {errors.age && <p>{errors.age.message}</p>}
  </div>
);
```

### Step 3: Define your form steps

```tsx
const steps = [
  { component: NameStep, fields: ["name"] },
  { component: AgeStep, fields: ["age"] },
];
```

### Step 4: Use `useMultiStepForm` in your form component

```tsx
import useMultiStepForm from "@oliver-lister/react-zod-multistep-form";

const MultiStepForm = () => {
  const {
    CurrentStep,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    handleSubmit,
    control,
    errors,
    register,
  } = useMultiStepForm<FormData>({
    steps,
    schema,
    initialValues: { name: "", age: 0 },
  });

  const onSubmit = (data: { name: string; age: number }) => {
    console.log(data);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <CurrentStep control={control} register={register} errors={errors} />
      {!isFirstStep && (
        <button type="button" onClick={() => goToPreviousStep()}>
          Back
        </button>
      )}
      {!isLastStep && (
        <button type="button" onClick={() => goToNextStep()}>
          Next
        </button>
      )}
      {isLastStep && <button type="submit">Submit</button>}
    </form>
  );
};
```

### Optional: Separate out Navigation Button logic

```tsx
type FormNavButtonsProps = {
  goToPreviousStep: () => void;
  goToNextStep: Promise<void>;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export const FormNavButtons: React.FC<NavProps> = ({
  goToPreviousStep,
  goToNextStep,
  isFirstStep,
  isLastStep,
}) => {
  return (
    <nav>
      {!isFirstStep && (
        <button type="button" onClick={goToPreviousStep}>
          Back
        </button>
      )}
      {!isLastStep && (
        <button type="button" onClick={goToNextStep}>
          Next
        </button>
      )}
      {isLastStep && <button type="submit">Submit</button>}
    </nav>
  );
};
```

### Step-by-Step Guide

1. **Define a Zod schema**: This schema validates each step of your form.
2. **Create form step components**: Use the `FormStepComponent` type to build
   form components that handle form fields and errors.
3. **Define form steps**: Create an array of objects where each object contains
   a `component` and `fields` that correspond to the Zod schema.
4. **Use the `useMultiStepForm` hook**: Manage form state, navigation, and
   validation across steps.
5. **Render the form**: Use the hook's `goToNextStep` and `goToPreviousStep`
   functions to control navigation between steps.

## API Reference

### Parameters

The `useMultiStepForm` hook accepts the following parameters:

- **`steps`**: An array of form steps, each with a `component` and a list of
  `fields` to validate.
- **`schema`**: A Zod schema that defines the structure and validation rules for
  your form data.
- **`initialValues`**: The initial values for each form field.

The hook also accepts a generic type that can be inferred from your Zod schema,
allowing for type-safe form handling.

### Return Values

The hook returns an object containing the following properties:

- **`CurrentStep`**: The current form step component to render.
- **`currentStepIndex`**: The index of the current step.
- **`setCurrentStepIndex`**: A function to manually set the current step index.
- **`goToNextStep`**: Function to move to the next step, ensuring the current
  step's validation passes.
- **`goToPreviousStep`**: Function to move to the previous step.
- **`isFirstStep`**: Boolean indicating if the current step is the first step.
- **`isLastStep`**: Boolean indicating if the current step is the last step.
- **`handleSubmit`**: The form submission handler from `react-hook-form`.
- **`control`**: The `control` object from `react-hook-form` for managing form
  fields.
- **`errors`**: An object containing validation errors for each form field.
- **`register`**: The `register` function from `react-hook-form` for registering
  form fields.

## License

This project is licensed under the Apache License 2.0.

---

This package simplifies the process of building multi-step forms with Zod
validation in React. If you encounter any issues or have suggestions for
improvements, feel free to open an issue or contribute to the repository!
