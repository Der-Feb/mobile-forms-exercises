import { Alert } from 'react-native';
import { FormField } from '../components/FormField';
import { FormScreen } from '../components/FormScreen';
import { SubmitButton, SuccessBanner } from '../components/FormParts';
import { OptionPicker } from '../components/OptionPicker';
import { Errors, useForm } from '../hooks/useForm';
import { isBlank, isEmail, isNumeric, isPhone, parseISODate } from '../lib/validators';

const GENDERS = ['Male', 'Female', 'Other'];
const PROGRAMS = ['Science', 'Arts', 'Commerce', 'Technology']; // placeholder: use your teacher's list

const initial = {
  studentName: '',
  dob: '',
  gender: '',
  nationality: '',
  email: '',
  phone: '',
  previousSchool: '',
  program: '',
  academicScore: '',
};
type Values = typeof initial;

function validate(v: Values): Errors<Values> {
  const e: Errors<Values> = {};

  if (isBlank(v.studentName)) e.studentName = 'Student name is required.';

  if (isBlank(v.dob)) {
    e.dob = 'Date of birth is required.';
  } else {
    const date = parseISODate(v.dob);
    if (!date) e.dob = 'Enter a valid date as YYYY-MM-DD.';
    else if (date > new Date()) e.dob = 'Date of birth cannot be in the future.';
  }

  if (!v.gender) e.gender = 'Please select a gender.';

  if (isBlank(v.nationality)) e.nationality = 'Nationality is required.';

  if (isBlank(v.email)) e.email = 'Email is required.';
  else if (!isEmail(v.email)) e.email = 'Email address is invalid.';

  if (isBlank(v.phone)) e.phone = 'Phone number is required.';
  else if (!isPhone(v.phone)) e.phone = 'Phone number is invalid.';

  if (isBlank(v.previousSchool)) e.previousSchool = 'Previous school is required.';

  if (!v.program) e.program = 'Please select a program.';

  // Order matters: range check first, then the challenge rule (>= 50).
  if (isBlank(v.academicScore)) {
    e.academicScore = 'Academic score is required.';
  } else if (!isNumeric(v.academicScore) || Number(v.academicScore) > 100) {
    e.academicScore = 'Academic score must be a number between 0 and 100.';
  } else if (Number(v.academicScore) < 50) {
    e.academicScore = 'Academic score must be at least 50 for the application to proceed.';
  }

  return e;
}

export default function StudentAdmission() {
  const form = useForm(initial, validate);

  const onSubmit = () =>
    form.submit((values) => {
      console.log(values);
      Alert.alert('Application received', `Thank you, ${values.studentName.trim()}. Your application was submitted.`);
    });

  return (
    <FormScreen title="Student Admission">
      {form.succeeded && <SuccessBanner message="Application submitted successfully!" />}

      <FormField label="Student name" autoCapitalize="words" {...form.field('studentName')} />
      <FormField
        label="Date of birth (YYYY-MM-DD)"
        placeholder="2008-05-21"
        keyboardType="numbers-and-punctuation"
        {...form.field('dob')}
      />

      <OptionPicker
        label="Gender"
        options={GENDERS}
        value={form.values.gender}
        onChange={(v) => { form.setValue('gender', v); form.touch('gender'); }}
        error={form.errorFor('gender')}
      />

      <FormField label="Nationality" autoCapitalize="words" {...form.field('nationality')} />
      <FormField label="Email" keyboardType="email-address" {...form.field('email')} />
      <FormField label="Phone" keyboardType="phone-pad" {...form.field('phone')} />
      <FormField label="Previous school" autoCapitalize="words" {...form.field('previousSchool')} />

      <OptionPicker
        label="Program"
        options={PROGRAMS}
        value={form.values.program}
        onChange={(v) => { form.setValue('program', v); form.touch('program'); }}
        error={form.errorFor('program')}
      />

      <FormField label="Academic score (0-100)" keyboardType="decimal-pad" {...form.field('academicScore')} />

      <SubmitButton title="Submit application" onPress={onSubmit} />
    </FormScreen>
  );
}