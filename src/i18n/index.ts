import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './en.json';
import ka from './ka.json';

export type AppLocale = 'ka' | 'en';

export const i18n = new I18n({ ka, en });
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.locale = deviceLocale();

export function deviceLocale(): AppLocale {
  return getLocales()[0]?.languageCode === 'ka' ? 'ka' : 'en';
}
