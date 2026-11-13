import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/labs/theme/ThemeProvider';
import type { DrawerParamList } from '@/navigation/types';

export function SettingsScreen() {
  const { mode, setMode, colors } = useAppTheme();
  const { locale, setLocale, t } = useLanguage();
  const dark = mode === 'dark';

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('settingsTitle')}</Text>
      <View style={styles.row}>
        <Text style={[styles.body, { color: colors.text }]}>{t('darkTheme')}</Text>
        <Switch value={dark} onValueChange={(enabled) => setMode(enabled ? 'dark' : 'light')} />
      </View>
      <Text style={[styles.body, { color: colors.text }]}>{t('language')}</Text>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" onPress={() => setLocale('ka')} style={[styles.language, locale === 'ka' && styles.languageActive]}>
          <Text style={locale === 'ka' ? styles.languageActiveText : styles.languageText}>ქართული</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => setLocale('en')} style={[styles.language, locale === 'en' && styles.languageActive]}>
          <Text style={locale === 'en' ? styles.languageActiveText : styles.languageText}>English</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function AboutScreen() {
  const { colors } = useAppTheme();
  const { t } = useLanguage();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const build = String(Constants.expoConfig?.android?.versionCode ?? Application.nativeBuildVersion ?? '1');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('aboutTitle')}</Text>
      <Text style={[styles.body, { color: colors.muted }]}>{t('aboutBody')}</Text>
      <Text style={[styles.body, { color: colors.text }]}>
        {t('version')}: {version}
      </Text>
      <Text style={[styles.body, { color: colors.text }]}>
        {t('build')}: {build}
      </Text>
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
    gap: 8,
  },
  language: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F4F2F8',
  },
  languageActive: {
    backgroundColor: '#6B2FD6',
  },
  languageText: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
  languageActiveText: {
    fontWeight: '700',
    color: '#FFFFFF',
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
