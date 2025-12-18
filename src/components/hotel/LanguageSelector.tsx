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
        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border-2 border-primary/40 hover:border-primary transition-all text-foreground shadow-md hover:shadow-lg min-w-[60px] md:min-w-auto"
        aria-label="Select language"
      >
        <Globe size={22} className="text-primary flex-shrink-0" />
        <span className="text-lg md:text-base font-body font-semibold">{currentLanguage.flag}</span>
        <span className="hidden lg:inline text-sm font-body font-medium">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay para móviles */}
          <div 
            className="fixed inset-0 bg-black/20 z-[99] md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 md:w-56 bg-card border-2 border-primary/30 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
            <div className="p-2">
              <div className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                Seleccionar Idioma
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleChangeLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary transition-colors rounded-lg ${
                    language === lang.code ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="flex-1 font-body text-sm font-medium text-foreground">{lang.name}</span>
                  {language === lang.code && (
                    <Check size={20} className="text-primary font-bold" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;

