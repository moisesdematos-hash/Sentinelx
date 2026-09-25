import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationDictionary, LANGUAGE_NAMES } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  languages: typeof LANGUAGE_NAMES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sentinelx_lang') as Language;
    if (saved && translations[saved]) return saved;

    // Browser language detection
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('en')) return 'en';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('fr')) return 'fr';
    return 'pt';
  });

  const setLanguage = (lang: Language) => {
    if (translations[lang]) {
      setLanguageState(lang);
      try {
        localStorage.setItem('sentinelx_lang', lang);
      } catch (e) {}
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const currentDict = translations[language] || translations.pt;
    const fallbackDict = translations.pt;

    let text = currentDict[key] || fallbackDict[key] || key;

    if (params) {
      Object.keys(params).forEach((paramKey) => {
        const value = params[paramKey];
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(value));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGE_NAMES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
