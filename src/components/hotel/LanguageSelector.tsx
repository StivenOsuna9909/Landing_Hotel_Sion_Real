import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe, Check } from 'lucide-react';
import type { Language } from '@/i18n/translations';

const languages = [
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'pt' as Language, name: 'Português', flag: '🇵🇹' },
];

const LanguageSelector = () => {
  const { language, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangeLanguage = (langCode: Language) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/95 hover:bg-background border-2 border-primary/30 hover:border-primary transition-all text-foreground shadow-sm"
        aria-label="Select language"
      >
        <Globe size={20} className="text-primary" />
        <span className="text-base font-body font-medium">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm font-body font-medium">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border-2 border-primary/20 rounded-xl shadow-elegant overflow-hidden z-[100]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary transition-colors ${
                language === lang.code ? 'bg-secondary border-l-4 border-l-primary' : ''
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="flex-1 font-body text-sm font-medium text-foreground">{lang.name}</span>
              {language === lang.code && (
                <Check size={18} className="text-primary font-bold" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

