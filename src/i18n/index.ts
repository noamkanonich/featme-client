import en from './en/translation.json';
import es from './es/translation.json';
import ru from './ru/translation.json';
import he from './he/translation.json';
import de from './de/translation.json';
import ar from './ar/translation.json';
import fr from './fr/translation.json';

import i18n from 'i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Platform } from 'react-native';
import { detectLanguage } from './detectLanguage';
import RNRestart from 'react-native-restart';

export const resources = {
  ar: {
    translation: ar,
    displayName: 'عربى',
  },
  de: {
    translation: de,
    displayName: 'Deutsch',
  },
  en: {
    translation: en,
    displayName: 'English',
  },
  es: {
    translation: es,
    displayName: 'Español',
  },
  fr: {
    translation: fr,
    displayName: 'Français',
  },
  he: {
    translation: he,
    displayName: 'עברית',
  },
  ru: {
    translation: ru,
    displayName: 'Pусский',
  },
};

const isRtl = () => i18next.dir() === 'rtl';

const onLanguageChanged = () => {
  const shouldRestart = Platform.OS !== 'web' && I18nManager.isRTL !== isRtl();
  I18nManager.allowRTL(isRtl());
  I18nManager.forceRTL(isRtl());
  I18nManager.isRTL = isRtl();
  if (shouldRestart) {
    // RNRestart.Restart();
  }
};

export const initI18n = async ({ language }: { language?: string }) => {
  i18n.on('languageChanged', onLanguageChanged);

  await i18n.use(initReactI18next).init({
    resources,
    lng: language || detectLanguage() || 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });
};

export default i18n;
