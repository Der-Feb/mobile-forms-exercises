import { Alert } from 'react-native';
import { FormField } from '../components/FormField';
import { FormScreen } from '../components/FormScreen';
import { SubmitButton, SuccessBanner } from '../components/FormParts';
import { OptionPicker } from '../components/OptionPicker';
import { Errors, useForm } from '../hooks/useForm';
import { isBlank, isEmail, isPhone, parseISODate } from '../lib/validators';

// Placeholder data: replace with whatever your teacher expects.
const DOCTORS: Record<string, string[]> = {
  'General Medicine': ['Dr. Mukamana', 'Dr. Niyonzima'],
  Cardiology: ['Dr. Habimana', 'Dr. Uwase'],
  Pediatrics: ['Dr. Ingabire', 'Dr. Nshuti'],
  Dentistry: ['Dr. Kamanzi'],
};
const DEPARTMENTS = Object.keys(DOCTORS);
const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

const initial = {
  patientName: '',
  phone: '',
  email: '',
  department: '',
  doctor: '',
  date: '',
  time: '',
  reason: '',
};
type Values = typeof initial;

function validate(v: Values): Errors<Values> {
  const e: Errors<Values> = {};

  if (isBlank(v.patientName)) e.patientName = 'Patient name is required.';

  if (isBlank(v.phone)) e.phone = 'Phone number is required.';
  else if (!isPhone(v.phone)) e.phone = 'Phone number is invalid.';

  // Optional, but must be valid if provided.
  if (!isBlank(v.email) && !isEmail(v.email)) e.email = 'Email address is invalid.';

  if (!v.department) e.department = 'Please select a department.';
  if (!v.doctor) e.doctor = 'Please select a doctor.';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isBlank(v.date)) {
    e.date = 'Appointment date is required.';
  } else {
    const date = parseISODate(v.date);
    if (!date) {
      e.date = 'Enter a valid date as YYYY-MM-DD.';
    } else if (date < today) {
      e.date = 'The appointment date cannot be in the past.';
    } else if (v.time && date.getTime() === today.getTime()) {
      // Booking for today: the slot must still be in the future.
      const [h, m] = v.time.split(':').map(Number);
      const slot = new Date();
      slot.setHours(h, m, 0, 0);
      if (slot <= new Date()) e.time = 'That time has already passed today.';
    }
  }

  if (!v.time && !e.time) e.time = 'Please select an appointment time.';

  if (isBlank(v.reason)) e.reason = 'Reason for visit is required.';
  else if (v.reason.trim().length < 10)
    e.reason = 'Reason for visit must contain at least 10 characters.';

  return e;
}

export default function Appointment() {
  const form = useForm(initial, validate);
  const v = form.values;

  const onSubmit = () =>
    form.submit((values) => {
      console.log(values);
      Alert.alert(
        'Appointment requested',
        `${values.doctor} (${values.department}) on ${values.date} at ${values.time}.`,
      );
    });

  return (
    <FormScreen title="Hospital Appointment">
      {form.succeeded && <SuccessBanner message="Appointment request submitted!" />}

      <FormField label="Patient name" autoCapitalize="words" {...form.field('patientName')} />
      <FormField label="Phone number" keyboardType="phone-pad" {...form.field('phone')} />
      <FormField
        label="Email (optional)"
        keyboardType="email-address"
        {...form.field('email')}
      />

      <OptionPicker
        label="Department"
        options={DEPARTMENTS}
        value={v.department}
        onChange={(d) => {
          form.setValue('department', d);
          form.setValue('doctor', ''); // a doctor from the old department must not survive
          form.touch('department');
        }}
        error={form.errorFor('department')}
      />

      <OptionPicker
        label={v.department ? 'Doctor' : 'Doctor (choose a department first)'}
        options={DOCTORS[v.department] ?? []}
        value={v.doctor}
        onChange={(d) => {
          form.setValue('doctor', d);
          form.touch('doctor');
        }}
        error={form.errorFor('doctor')}
      />

      <FormField
        label="Appointment date (YYYY-MM-DD)"
        placeholder="2026-12-01"
        keyboardType="numbers-and-punctuation"
        {...form.field('date')}
      />

      <OptionPicker
        label="Appointment time"
        options={TIME_SLOTS}
        value={v.time}
        onChange={(t) => {
          form.setValue('time', t);
          form.touch('time');
        }}
        error={form.errorFor('time')}
      />

      <FormField label="Reason for visit" multiline {...form.field('reason')} />

      <SubmitButton title="Request appointment" dimmed={!form.isValid} onPress={onSubmit} />
    </FormScreen>
  );
}