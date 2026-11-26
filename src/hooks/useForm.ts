import { useState } from 'react';

export type Errors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(
  initial: T,
  validate: (values: T) => Errors<T>,
) {
  const [values, setValues] = useState<T>(initial);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    setSucceeded(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  };
  const touch = (key: keyof T) => setTouched((p) => ({ ...p, [key]: true }));
  const errorFor = (key: keyof T) =>
    touched[key] || submitted ? errors[key] : undefined;

  // Props for a text field: {...form.field('email')}
  const field = (key: keyof T) => ({
    value: String(values[key] ?? ''),
    onChangeText: (text: string) => setValue(key, text as T[keyof T]),
    onBlur: () => touch(key),
    error: errorFor(key),
  });

  const submit = (onValid: (values: T) => void) => {
    setSubmitted(true);
    if (!isValid) return;      // submission blocked
    onValid(values);
    setSucceeded(true);
  };

  const reset = () => {
    setValues(initial);
    setTouched({});
    setSubmitted(false);
    setSucceeded(false);
  };

  return { values, setValue, touch, errorFor, field, isValid, submit, succeeded, reset };
}
