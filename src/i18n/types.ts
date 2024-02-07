import type { ui, defaultLang } from './ui';

export type i18nKey = keyof (typeof ui)[typeof defaultLang];
