import { StyleSheet, Text, View } from 'react-native';
import { FormField } from '../components/FormField';
import { FormScreen } from '../components/FormScreen';
import { SubmitButton, SuccessBanner } from '../components/FormParts';
import { OptionPicker } from '../components/OptionPicker';
import { Errors, useForm } from '../hooks/useForm';
import { isBlank, isEmail, isPhone } from '../lib/validators';

const ATTENDANCE_TYPES = ['Physical', 'Virtual'];

const initial = {
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  jobTitle: '',
  attendanceType: '',
  days: '',
  dietary: '', // optional
};
type Values = typeof initial;

function validate(v: Values): Errors<Values> {
  const e: Errors<Values> = {};

  if (isBlank(v.fullName)) e.fullName = 'Full name is required.';

  if (isBlank(v.email)) e.email = 'Email is required.';
  else if (!isEmail(v.email)) e.email = 'Email address is invalid.';

  if (isBlank(v.phone)) e.phone = 'Phone number is required.';
  else if (!isPhone(v.phone)) e.phone = 'Phone number is invalid.';

  if (isBlank(v.organization)) e.organization = 'Organization is required.';
  if (isBlank(v.jobTitle)) e.jobTitle = 'Job title is required.';
  if (!v.attendanceType) e.attendanceType = 'Please select an attendance type.';

  if (isBlank(v.days)) {
    e.days = 'Number of days is required.';
  } else if (
    !/^\d+$/.test(v.days.trim()) ||
    Number(v.days) < 1 ||
    Number(v.days) > 3
  ) {
    e.days = 'Number of days must be a whole number between 1 and 3.';
  }

  // Dietary requirement is optional: no rule.

  return e;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function EventRegistration() {
  const form = useForm(initial, validate);
  const v = form.values;

  // The summary replaces the form after a successful validation.
  if (form.succeeded) {
    return (
      <FormScreen title="Registration Successful">
        <SuccessBanner message="Registration Successful" />
        <View style={styles.summary}>
          <SummaryRow label="Name" value={v.fullName.trim()} />
          <SummaryRow label="Organization" value={v.organization.trim()} />
          <SummaryRow label="Attendance" value={v.attendanceType} />
          <SummaryRow label="Days" value={String(Number(v.days))} />
        </View>
        <SubmitButton title="Register another participant" onPress={form.reset} />
      </FormScreen>
    );
  }

  return (
    <FormScreen title="Event Registration">
      <FormField label="Full name" autoCapitalize="words" {...form.field('fullName')} />
      <FormField label="Email" keyboardType="email-address" {...form.field('email')} />
      <FormField label="Phone" keyboardType="phone-pad" {...form.field('phone')} />
      <FormField label="Organization" autoCapitalize="words" {...form.field('organization')} />
      <FormField label="Job title" autoCapitalize="words" {...form.field('jobTitle')} />

      <OptionPicker
        label="Attendance type"
        options={ATTENDANCE_TYPES}
        value={v.attendanceType}
        onChange={(t) => {
          form.setValue('attendanceType', t);
          form.touch('attendanceType');
        }}
        error={form.errorFor('attendanceType')}
      />

      <FormField
        label="Number of days (1-3)"
        keyboardType="number-pad"
        {...form.field('days')}
      />
      <FormField
        label="Dietary requirement (optional)"
        autoCapitalize="sentences"
        {...form.field('dietary')}
      />

      <SubmitButton
        title="Register"
        dimmed={!form.isValid}
        onPress={() => form.submit((values) => console.log(values))}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    padding: 16,
    gap: 12,
  },
  row: { gap: 2 },
  rowLabel: { fontSize: 13, color: '#667085' },
  rowValue: { fontSize: 16, fontWeight: '600', color: '#17212F' },
});
