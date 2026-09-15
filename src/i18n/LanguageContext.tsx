import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Language, translations } from './translations';

interface LanguageContextValue {
  language: Language;
  isRTL: boolean;
  t: (path: string) => string;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getNested(obj: any, path: string): string {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj) ?? path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      isRTL: language === 'ar',
      t: (path: string) => getNested(translations[language], path),
      setLanguage,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
  return ctx;
}
