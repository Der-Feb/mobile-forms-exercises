import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function OptionPicker({ label, options, value, onChange, error }: Props) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#17212F' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  chipSelected: { backgroundColor: '#2878D0', borderColor: '#2878D0' },
  chipText: { fontSize: 15, color: '#17212F' },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  error: { color: '#D92D20', fontSize: 13 },
});