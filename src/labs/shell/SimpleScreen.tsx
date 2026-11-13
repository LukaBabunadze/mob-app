import type { DrawerScreenProps } from '@react-navigation/drawer';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useAppTheme } from '@/labs/theme/ThemeProvider';
import type { DrawerParamList } from '@/navigation/types';

export function SettingsScreen() {
  const { mode, setMode, colors } = useAppTheme();
  const dark = mode === 'dark';

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>პარამეტრები</Text>
      <View style={styles.row}>
        <Text style={[styles.body, { color: colors.text }]}>მუქი თემა</Text>
        <Switch value={dark} onValueChange={(enabled) => setMode(enabled ? 'dark' : 'light')} />
      </View>
    </View>
  );
}

export function AboutScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>შესახებ</Text>
      <Text style={styles.body}>მობილური აპლიკაციების დაპროგრამება, 2026.</Text>
    </View>
  );
}

export function LogoutScreen({ navigation }: DrawerScreenProps<DrawerParamList, 'Logout'>) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>გასვლა</Text>
      <Text style={styles.body}>ანგარიშიდან გამოხვედით.</Text>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Main', { screen: 'Home' })} style={styles.button}>
        <Text style={styles.buttonText}>შესვლა</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    fontSize: 16,
    color: '#6F6888',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#6B2FD6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
