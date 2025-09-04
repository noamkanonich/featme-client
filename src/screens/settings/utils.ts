export const languageData = [
  { label: 'English', value: 'en', flag: '🇺🇸' },
  { label: 'עברית', value: 'he', flag: '🇮🇱' },
  { label: 'Spanish', value: 'es', flag: '🇪🇸' },
  { label: 'French', value: 'fr', flag: '🇫🇷' },
  { label: 'German', value: 'de', flag: '🇩🇪' },
];

export const flagFor = (val: string) =>
  languageData.find(x => x.value === val)?.flag || '🏳️';

export const themeData = [
  { label: 'Light', value: 'light', icon: '🌞' },
  { label: 'Dark', value: 'dark', icon: '🌜' },
  { label: 'System Default', value: 'system', icon: '🖥️' },
];

export const themeIcon = (val: string) =>
  themeData.find(x => x.value === val)?.icon || '🌞';
