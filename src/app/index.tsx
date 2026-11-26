import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.mark}>
          <View style={styles.markLine} />
          <View style={styles.markLine} />
          <View style={[styles.markLine, styles.shortLine]} />
        </View>
        <View style={styles.headingGroup}>
          <Text style={styles.eyebrow}>PRACTICE PROJECT</Text>
          <Text style={styles.title}>Mobile Form Exercises</Text>
          <Text style={styles.description}>
            A collection of practical forms built with React Native.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  mark: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#E9F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
  },
  markLine: {
    width: 30,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#2878D0',
  },
  shortLine: {
    width: 20,
    alignSelf: 'center',
  },
  headingGroup: {
    alignItems: 'center',
    gap: 12,
    maxWidth: 340,
  },
  eyebrow: {
    color: '#2878D0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: '#17212F',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'center',
  },
  description: {
    color: '#667085',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
