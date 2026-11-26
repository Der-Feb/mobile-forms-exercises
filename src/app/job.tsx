import { CvPicker } from '../components/CvPicker';
import { FormField } from '../components/FormField';
import { FormScreen } from '../components/FormScreen';
import { SubmitButton, SuccessBanner } from '../components/FormParts';
import { OptionPicker } from '../components/OptionPicker';
import { Errors, useForm } from '../hooks/useForm';
import { isBlank, isEmail, isPhone } from '../lib/validators';

// Placeholder options: replace with your teacher's lists.
const POSITIONS = ['Software Developer', 'Accountant', 'Marketing Officer', 'Customer Support'];
const EDUCATION = ['High school', 'Diploma', 'Bachelor', 'Master', 'PhD'];
const MIN_COVER_LETTER = 50;

const initial = {
  fullName: '',
  email: '',
  phone: '',
  position: '',
  education: '',
  yearsOfExperience: '',
  coverLetter: '',
  cv: '', // file name
};
type Values = typeof initial;

function validate(v: Values): Errors<Values> {
  const e: Errors<Values> = {};

  if (isBlank(v.fullName)) e.fullName = 'Full name is required.';

  if (isBlank(v.email)) e.email = 'Email is required.';
  else if (!isEmail(v.email)) e.email = 'Email address is invalid.';

  if (isBlank(v.phone)) e.phone = 'Phone number is required.';
  else if (!isPhone(v.phone)) e.phone = 'Phone number is invalid.';

  if (!v.position) e.position = 'Please select a position.';
  if (!v.education) e.education = 'Please select an education level.';

  if (isBlank(v.yearsOfExperience)) {
    e.yearsOfExperience = 'Years of experience is required.';
  } else if (!/^\d+(\.\d+)?$/.test(v.yearsOfExperience.trim())) {
    e.yearsOfExperience = 'Years of experience must be a number, 0 or greater.';
  }

  if (isBlank(v.coverLetter)) e.coverLetter = 'Cover letter is required.';
  else if (v.coverLetter.trim().length < MIN_COVER_LETTER)
    e.coverLetter = `Cover letter must contain at least ${MIN_COVER_LETTER} characters.`;

  if (isBlank(v.cv)) e.cv = 'Please select your CV.';
  else if (!/\.(pdf|docx?)$/i.test(v.cv.trim())) e.cv = 'CV must be a PDF or Word file.';

  return e;
}

export default function JobApplication() {
  const form = useForm(initial, validate);
  const v = form.values;

  // Success replaces the form, so it can't be missed below the fold.
  if (form.succeeded) {
    return (
      <FormScreen title="Job Application">
        <SuccessBanner message="Application submitted successfully" />
        <SubmitButton title="Submit another application" onPress={form.reset} />
      </FormScreen>
    );
  }

  return (
    <FormScreen title="Job Application">
      <FormField label="Full name" autoCapitalize="words" {...form.field('fullName')} />
      <FormField label="Email" keyboardType="email-address" {...form.field('email')} />
      <FormField label="Phone" keyboardType="phone-pad" {...form.field('phone')} />

      <OptionPicker
        label="Position"
        options={POSITIONS}
        value={v.position}
        onChange={(p) => {
          form.setValue('position', p);
          form.touch('position');
        }}
        error={form.errorFor('position')}
      />
      <OptionPicker
        label="Education level"
        options={EDUCATION}
        value={v.education}
        onChange={(ed) => {
          form.setValue('education', ed);
          form.touch('education');
        }}
        error={form.errorFor('education')}
      />

      <FormField
        label="Years of experience"
        keyboardType="numbers-and-punctuation"
        {...form.field('yearsOfExperience')}
      />
      <FormField
        label={`Cover letter ${v.coverLetter.trim().length}/${MIN_COVER_LETTER} min`}
        multiline
        {...form.field('coverLetter')}
      />

      <CvPicker
        value={v.cv}
        onChange={(name) => form.setValue('cv', name)}
        onBlur={() => form.touch('cv')}
        error={form.errorFor('cv')}
      />

      <SubmitButton
        title="Submit application"
        dimmed={!form.isValid}
        onPress={() => form.submit((values) => console.log(values))}
      />
    </FormScreen>
  );
}
