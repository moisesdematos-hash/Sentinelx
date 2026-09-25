import { pt } from './translations/pt';
import { en } from './translations/en';
import { es } from './translations/es';
import { fr } from './translations/fr';

export type Language = 'pt' | 'en' | 'es' | 'fr';

export interface TranslationDictionary {
  [key: string]: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  pt,
  en,
  es,
  fr,
};

export const LANGUAGE_NAMES: Record<Language, { name: string; flag: string }> = {
  pt: { name: 'Português', flag: '🇵🇹' },
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
};
