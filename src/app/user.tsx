import { FormField } from '../components/FormField';
import { FormScreen } from '../components/FormScreen';
import { SubmitButton, SuccessBanner, SwitchField } from '../components/FormParts';
import { Errors, useForm } from '../hooks/useForm';
import { isBlank, isEmail, isPhone } from '../lib/validators';

const initial = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  acceptTerms: false,
};
type Values = typeof initial;

function validate(v: Values): Errors<Values> {
  const e: Errors<Values> = {};

  if (isBlank(v.fullName)) e.fullName = 'Full name is required.';
  else if (v.fullName.trim().length < 3) e.fullName = 'Full name must be at least 3 characters.';

  if (!isEmail(v.email)) e.email = 'Email address is invalid.';

  if (v.password.length < 8) e.password = 'Password must contain at least 8 characters.';

  if (v.confirmPassword !== v.password) e.confirmPassword = 'Passwords do not match.';

  if (isBlank(v.phone)) e.phone = 'Phone number is required.';
  else if (!isPhone(v.phone)) e.phone = 'Phone number is invalid.';

  if (!v.acceptTerms) e.acceptTerms = 'You must accept the terms and conditions.';

  return e;
}

export default function UserRegistration() {
  const form = useForm(initial, validate);

  return (
    <FormScreen title="User Registration">
      {form.succeeded && <SuccessBanner message="Registration successful!" />}

      <FormField label="Full name" {...form.field('fullName')} autoCapitalize="words" />
      <FormField label="Email" keyboardType="email-address" {...form.field('email')} />
      <FormField label="Password" secureTextEntry {...form.field('password')} />
      <FormField label="Confirm password" secureTextEntry {...form.field('confirmPassword')} />
      <FormField label="Phone number" keyboardType="phone-pad" {...form.field('phone')} />

      <SwitchField
        label="I accept the terms and conditions"
        value={form.values.acceptTerms}
        onValueChange={(v) => {
          form.setValue('acceptTerms', v);
          form.touch('acceptTerms');
        }}
        error={form.errorFor('acceptTerms')}
      />

      <SubmitButton
        title="Register"
        onPress={() => form.submit((values) => console.log(values))}
      />
    </FormScreen>
  );
}
