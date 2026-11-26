import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  value: string; // file name
  onChange: (name: string) => void;
  onBlur?: () => void;
  error?: string;
};

export function CvPicker({ value, onChange, onBlur, error }: Props) {
  const pickOnWeb = () => {
    const doc = (globalThis as any).document;
    const input = doc.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) onChange(file.name);
      onBlur?.();
    };
    input.click();
  };

  return (
    <View style={styles.group}>
      <Text style={styles.label}>CV</Text>

      {Platform.OS === 'web' ? (
        <Pressable style={[styles.pick, !!error && styles.pickError]} onPress={pickOnWeb}>
          <Text style={styles.pickText}>{value || 'Choose CV (PDF or Word)'}</Text>
        </Pressable>
      ) : (
        <TextInput
          style={[styles.input, !!error && styles.pickError]}
          placeholder="CV file name, e.g. my-cv.pdf"
          placeholderTextColor="#98A2B3"
          autoCapitalize="none"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
        />
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#17212F' },
  pick: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#17212F',
  },
  pickError: { borderColor: '#D92D20' },
  pickText: { color: '#2878D0', fontSize: 15, fontWeight: '600' },
  error: { color: '#D92D20', fontSize: 13 },
});
