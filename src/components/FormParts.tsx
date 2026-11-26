import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

export function SubmitButton({
  title, onPress, disabled,
}: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <View style={styles.success}>
      <Text style={styles.successText}>{message}</Text>
    </View>
  );
}

export function SwitchField({
  label, value, onValueChange, error,
}: { label: string; value: boolean; onValueChange: (v: boolean) => void; error?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <View style={styles.row}>
        <Switch value={value} onValueChange={onValueChange} />
        <Text style={styles.rowText}>{label}</Text>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: '#2878D0', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#98A2B3' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  success: { backgroundColor: '#ECFDF3', borderColor: '#12B76A', borderWidth: 1, borderRadius: 10, padding: 12 },
  successText: { color: '#027A48', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowText: { fontSize: 15, color: '#17212F', flexShrink: 1 },
  error: { color: '#D92D20', fontSize: 13 },
});
