import { Href, Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const links: { link: Href; description: string }[] = [
  { link: '/user', description: 'User registration' },
  { link: '/student', description: 'Student admission' },
  { link: '/transfer', description: 'Online banking transfer' },
  { link: '/appointment', description: 'Hospital appointment' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* This wrapper takes up all available space and centers your main text */}
      <View style={styles.content}>
        <View style={styles.headingGroup}>
          <Text style={styles.eyebrow}>PRACTICE PROJECT</Text>
          <Text style={styles.title}>Mobile Form Exercises</Text>
          <Text style={styles.description}>
            A collection of practical forms built with React Native.
          </Text>
        </View>

        <View style={styles.links}>
          {links.map((item, ndx) => (
            <Link key={ndx}  href={item.link} asChild>
              <Pressable>
                <Text style={styles.linkText}>{item.description}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>

      <Text style={styles.footer_description}>
        Exercises given by teacher.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    flex: 1, // Expands to fill all space above the footer
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
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
  links: {
    marginTop: 32,
    textDecorationLine: 'underline',
    textDecorationColor: '#2878D0',
    padding: 12,
    borderRadius: 12
  },
  linkText: {
    color: '#2878D0',
  },
  description: {
    color: '#667085',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer_description: {
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 20,
  },
});
