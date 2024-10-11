# React Zod Multi-Step Form Hook

`@oliver-lister/react-zod-multistep-form` is a lightweight React hook designed
to simplify the management of multi-step forms. It integrates `react-hook-form`
with `Zod` schema validation to handle form state, validation, and error
management across multiple steps. With this hook, navigating between form steps
becomes seamless while maintaining robust validation and form control.

## Features

- **Multi-step form management:** Easily navigate through multiple form steps.
- **Zod schema validation:** Integrates `Zod` for schema-based validation at
  each step.
- **React Hook Form integration:** Leverages `react-hook-form` to manage form
  state, registration, and validation.
- **Error handling:** Provides detailed error management for each form step.
- **Callbacks for next and back navigation:** Simple API for moving between
  steps while ensuring validation is respected.

## Installation

```bash
npm install @oliver-lister/react-zod-multistep-form
```

## Usage

```tsx
import React from "react";
import { z } from "zod";
import useMultiStepForm, {
  FormStepComponent,
} from "@oliver-lister/react-zod-multistep-form";
import { useFormContext } from "react-hook-form";

// Define your form schema with Zod
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.number().min(18, "Must be at least 18"),
});

// Define your form steps
const NameStep: FormStepComponent<{ name: string }> = ({
  register,
  errors,
}) => (
  <div>
    <label>Name</label>
    <input {...register("name")} />
    {errors.name && <p>{errors.name.message}</p>}
  </div>
);

const AgeStep: FormStepComponent<{ age: number }> = ({ register, errors }) => (
  <div>
    <label>Age</label>
    <input type="number" {...register("age")} />
    {errors.age && <p>{errors.age.message}</p>}
  </div>
);

const steps = [
  { component: NameStep, fields: ["name"] },
  { component: AgeStep, fields: ["age"] },
];

// Example usage of the hook in your form component
const MultiStepForm = () => {
  const {
    CurrentStepComponent,
    next,
    back,
    isFirstStep,
    isLastStep,
    handleSubmit,
    control,
    errors,
    register,
  } = useMultiStepForm({
    steps,
    schema,
    initialValues: { name: "", age: 0 },
  });

  const onSubmit = (data: { name: string; age: number }) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CurrentStepComponent
        control={control}
        register={register}
        errors={errors}
      />
      {!isFirstStep && (
        <button type="button" onClick={back}>
          Back
        </button>
      )}
      {!isLastStep && (
        <button type="button" onClick={next}>
          Next
        </button>
      )}
      {isLastStep && <button type="submit">Submit</button>}
    </form>
  );
};

export default MultiStepForm;
```

### Step-by-Step Example

1. **Define a Zod schema** to validate each step of your form.
2. **Create form step components** using the `FormStepComponent` type. These
   components will display form fields and handle errors.
3. **Define your form steps** by creating an array of objects, where each object
   has a `component` (your form step) and `fields` (the fields to validate).
4. **Use the `useMultiStepForm` hook** to manage form state, navigation, and
   validation across steps.
5. **Render the form** and control the step navigation with the provided `next`
   and `back` functions.

### Parameters

The `useMultiStepForm` hook accepts the following parameters:

- **`steps`**: An array of form steps, where each step has a `component` and a
  list of fields for validation.
- **`schema`**: A Zod schema that defines the structure and validation for your
  form data.
- **`initialValues`**: The initial form values for each field.

### Returns

The hook returns an object with several useful properties and functions:

- **`CurrentStepComponent`**: The current step's component to render.
- **`currentStepIndex`**: The index of the current step.
- **`setCurrentStepIndex`**: A function to manually set the current step index.
- **`next`**: Moves to the next step, ensuring that the current step's
  validation passes.
- **`back`**: Moves back to the previous step.
- **`isFirstStep`**: A boolean indicating whether the current step is the first
  step.
- **`isLastStep`**: A boolean indicating whether the current step is the last
  step.
- **`handleSubmit`**: The submit handler for the form.
- **`control`**: The control object from `react-hook-form`.
- **`errors`**: The errors object from `react-hook-form`.
- **`register`**: The register function from `react-hook-form`.

## License

This project is licensed under the Apache License 2.0
 
---

This package helps you easily build multi-step forms with Zod validation in
React. If you encounter any issues or have feedback, feel free to open an issue
or contribute to the repository!
