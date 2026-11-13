import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { deviceLocale, i18n, type AppLocale } from '@/i18n';

const LANGUAGE_KEY = 'app-language';

type LanguageContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(deviceLocale());

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((stored) => {
      if (stored === 'ka' || stored === 'en') {
        i18n.locale = stored;
        setLocaleState(stored);
      }
    });
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    i18n.locale = locale;
    return {
      locale,
      setLocale: (next) => {
        i18n.locale = next;
        setLocaleState(next);
        AsyncStorage.setItem(LANGUAGE_KEY, next);
      },
      t: (key) => i18n.t(key),
    };
  }, [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return value;
}
