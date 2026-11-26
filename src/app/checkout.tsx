import { StyleSheet, Text, View } from 'react-native';
import { FormField } from '../components/FormField';
import { FormScreen } from '../components/FormScreen';
import { SubmitButton, SuccessBanner } from '../components/FormParts';
import { OptionPicker } from '../components/OptionPicker';
import { Errors, useForm } from '../hooks/useForm';
import { isBlank, isEmail, isPhone } from '../lib/validators';

// Placeholder options: replace with your teacher's lists.
const PAYMENT_METHODS = ['Mobile Money', 'Card', 'Cash on delivery'];
const DELIVERY_OPTIONS = ['Standard', 'Express', 'Pickup'];

const initial = {
  customerName: '',
  phone: '',
  email: '',
  deliveryAddress: '',
  city: '',
  quantity: '',
  paymentMethod: '',
  deliveryOption: '',
};
type Values = typeof initial;

function validate(v: Values): Errors<Values> {
  const e: Errors<Values> = {};

  if (isBlank(v.customerName)) e.customerName = 'Customer name is required.';

  if (isBlank(v.phone)) e.phone = 'Phone number is required.';
  else if (!isPhone(v.phone)) e.phone = 'Phone number is invalid.';

  if (isBlank(v.email)) e.email = 'Email is required.';
  else if (!isEmail(v.email)) e.email = 'Email address is invalid.';

  if (isBlank(v.deliveryAddress)) e.deliveryAddress = 'Delivery address is required.';
  if (isBlank(v.city)) e.city = 'City is required.';

  // Order matters: number check, then the challenge rule (<= 0), then integer check.
  if (isBlank(v.quantity)) {
    e.quantity = 'Quantity is required.';
  } else if (!/^-?\d+(\.\d+)?$/.test(v.quantity.trim())) {
    e.quantity = 'Quantity must be a number.';
  } else if (Number(v.quantity) <= 0) {
    e.quantity = 'Quantity must be greater than 0';
  } else if (!Number.isInteger(Number(v.quantity))) {
    e.quantity = 'Quantity must be a whole number.';
  }

  if (!v.paymentMethod) e.paymentMethod = 'Please select a payment method.';
  if (!v.deliveryOption) e.deliveryOption = 'Please select a delivery option.';

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

export default function Checkout() {
  const form = useForm(initial, validate);
  const v = form.values;

  // The order summary replaces the form after a successful validation.
  if (form.succeeded) {
    return (
      <FormScreen title="Order Summary">
        <SuccessBanner message="Order placed successfully!" />
        <View style={styles.summary}>
          <SummaryRow label="Customer" value={v.customerName.trim()} />
          <SummaryRow label="Phone" value={v.phone.trim()} />
          <SummaryRow label="Email" value={v.email.trim()} />
          <SummaryRow label="Deliver to" value={`${v.deliveryAddress.trim()}, ${v.city.trim()}`} />
          <SummaryRow label="Quantity" value={String(Number(v.quantity))} />
          <SummaryRow label="Payment method" value={v.paymentMethod} />
          <SummaryRow label="Delivery option" value={v.deliveryOption} />
        </View>
        <SubmitButton title="Place another order" onPress={form.reset} />
      </FormScreen>
    );
  }

  return (
    <FormScreen title="Checkout">
      <FormField label="Customer name" autoCapitalize="words" {...form.field('customerName')} />
      <FormField label="Phone number" keyboardType="phone-pad" {...form.field('phone')} />
      <FormField label="Email" keyboardType="email-address" {...form.field('email')} />
      <FormField label="Delivery address" autoCapitalize="words" {...form.field('deliveryAddress')} />
      <FormField label="City" autoCapitalize="words" {...form.field('city')} />
      <FormField
        label="Product quantity"
        keyboardType="numbers-and-punctuation"
        {...form.field('quantity')}
      />

      <OptionPicker
        label="Payment method"
        options={PAYMENT_METHODS}
        value={v.paymentMethod}
        onChange={(p) => {
          form.setValue('paymentMethod', p);
          form.touch('paymentMethod');
        }}
        error={form.errorFor('paymentMethod')}
      />
      <OptionPicker
        label="Delivery option"
        options={DELIVERY_OPTIONS}
        value={v.deliveryOption}
        onChange={(d) => {
          form.setValue('deliveryOption', d);
          form.touch('deliveryOption');
        }}
        error={form.errorFor('deliveryOption')}
      />

      <SubmitButton
        title="Place order"
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
