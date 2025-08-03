import { useAppConfig } from '@/utils/appConfig';
import enGB from '../../locales/en-GB.json';
import nlNL from '../../locales/nl-NL.json';

const translations = {
  'en-GB': enGB,
  'nl-NL': nlNL,
};

type TranslationKey = keyof typeof translations;

export function useTranslation() {
  const appConfig = useAppConfig();
  const configLanguage = appConfig?.configs.language;
  const currentLanguage = (configLanguage || 'en-GB') as TranslationKey;
  const t = translations[currentLanguage];

  const translate = (key: string, variables?: Record<string, string>): string => {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = t;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    if (variables) {
      return Object.entries(variables).reduce((str, [varKey, varValue]) => {
        return str.replace(new RegExp(`{${varKey}}`, 'g'), varValue);
      }, value);
    }
    
    return value;
  };

  return { t: translate, language: currentLanguage };
}
