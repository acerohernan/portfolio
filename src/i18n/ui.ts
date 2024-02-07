import enJson from './languages/en.json';
import esJson from './languages/es.json';

export const languages = {
  en: 'English',
  es: 'Español',
};

export const defaultLang = 'en';

export const ui = {
  en: enJson,
  es: esJson,
} as const;
