import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FormField } from '../components/FormField';
import { FormScreen } from '../components/FormScreen';
import { SubmitButton, SuccessBanner } from '../components/FormParts';
import { OptionPicker } from '../components/OptionPicker';
import { Errors, useForm } from '../hooks/useForm';
import { isBlank, isDigits } from '../lib/validators';

const CURRENCIES = ['RWF', 'USD', 'EUR']; // placeholder: change to what your teacher expects
const MAX_DESCRIPTION = 100;

const initial = {
  accountName: '',
  accountNumber: '',
  amount: '',
  currency: '',
  description: '',
  pin: '',
};
type Values = typeof initial;

function validate(v: Values): Errors<Values> {
  const e: Errors<Values> = {};

  if (isBlank(v.accountName)) e.accountName = 'Account name is required.';

  if (isBlank(v.accountNumber)) e.accountNumber = 'Account number is required.';
  else if (!isDigits(v.accountNumber.trim())) e.accountNumber = 'Account number must contain digits only.';

  // Accept negatives in the pattern so -500 reaches the "greater than 0" rule.
  if (isBlank(v.amount)) {
    e.amount = 'Amount is required.';
  } else if (!/^-?\d+(\.\d+)?$/.test(v.amount.trim())) {
    e.amount = 'Amount must be a number.';
  } else if (Number(v.amount) <= 0) {
    e.amount = 'Amount must be greater than 0.';
  }

  if (!v.currency) e.currency = 'Please select a currency.';

  if (v.description.length > MAX_DESCRIPTION)
    e.description = `Description must be at most ${MAX_DESCRIPTION} characters.`;

  if (isBlank(v.pin)) e.pin = 'PIN is required.';
  else if (!/^\d{4}$/.test(v.pin)) e.pin = 'PIN must be exactly 4 digits.';

  return e;
}

type Step = 'form' | 'confirm' | 'done';

export default function Transfer() {
  const form = useForm(initial, validate);
  const [step, setStep] = useState<Step>('form');
  const v = form.values;

  if (step === 'done') {
    return (
      <FormScreen title="Transfer complete">
        <SuccessBanner
          message={`${v.amount.trim()} ${v.currency} sent to ${v.accountName.trim()}.`}
        />
        <SubmitButton
          title="New transfer"
          onPress={() => {
            form.reset();
            setStep('form');
          }}
        />
      </FormScreen>
    );
  }

  if (step === 'confirm') {
    return (
      <FormScreen title="Confirm transfer">
        <View style={styles.summary}>
          <SummaryRow label="Account name" value={v.accountName.trim()} />
          <SummaryRow label="Account number" value={v.accountNumber.trim()} />
          <SummaryRow label="Amount" value={`${v.amount.trim()} ${v.currency}`} />
          {!isBlank(v.description) && (
            <SummaryRow label="Description" value={v.description.trim()} />
          )}
        </View>

        <SubmitButton
          title="Confirm transfer"
          onPress={() => {
            console.log({ ...v, pin: '****' }); // never log the real PIN
            setStep('done');
          }}
        />
        <Pressable style={styles.secondary} onPress={() => setStep('form')}>
          <Text style={styles.secondaryText}>Edit details</Text>
        </Pressable>
      </FormScreen>
    );
  }

  return (
    <FormScreen title="Money Transfer">
      <FormField label="Account name" autoCapitalize="words" {...form.field('accountName')} />
      <FormField label="Account number" keyboardType="number-pad" {...form.field('accountNumber')} />
      <FormField
        label="Amount"
        keyboardType="numbers-and-punctuation"
        {...form.field('amount')}
      />

      <OptionPicker
        label="Currency"
        options={CURRENCIES}
        value={v.currency}
        onChange={(c) => {
          form.setValue('currency', c);
          form.touch('currency');
        }}
        error={form.errorFor('currency')}
      />

      <FormField
        label={`Transfer description (optional) ${v.description.length}/${MAX_DESCRIPTION}`}
        multiline
        {...form.field('description')}
      />
      <FormField
        label="PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        {...form.field('pin')}
      />

      <SubmitButton
        title="Review transfer"
        dimmed={!form.isValid}
        onPress={() => form.submit(() => setStep('confirm'))}
      />
    </FormScreen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
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
  secondary: { alignItems: 'center', paddingVertical: 12 },
  secondaryText: { color: '#2878D0', fontSize: 16, fontWeight: '600' },
});
