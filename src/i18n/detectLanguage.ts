import {getLocales} from 'react-native-localize';

export const detectLanguage: () => string | null = () => {
  const detectedLocales = getLocales().map(locale => locale.languageCode);
  return detectedLocales.length ? detectedLocales[0] : null;
};
