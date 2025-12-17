import { useState, useEffect } from 'react';
import { translations, getLanguage, setLanguage, type Language } from '@/i18n/translations';

type TranslationKey = keyof typeof translations.es;

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const useTranslation = () => {
  const [language, setLang] = useState<Language>(getLanguage);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLang(getLanguage());
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const t = (key: string, params?: Record<string, any>): string => {
    const value = getNestedValue(translations[language], key);
    
    if (typeof value === 'function') {
      return value(params?.year || new Date().getFullYear());
    }
    
    if (typeof value === 'string') {
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match;
        });
      }
      return value;
    }
    
    // Si no se encuentra, intentar con español como fallback
    if (language !== 'es') {
      const fallbackValue = getNestedValue(translations.es, key);
      if (typeof fallbackValue === 'string') {
        return fallbackValue;
      }
      if (typeof fallbackValue === 'function') {
        return fallbackValue(params?.year || new Date().getFullYear());
      }
    }
    
    return key; // Fallback to key if translation not found
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setLang(lang);
  };

  return { t, language, changeLanguage };
};

