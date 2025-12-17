import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-foreground text-cream py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl mb-4">Hotel Sion Real</h3>
            <p className="font-body text-cream/70 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4">{t('footer.links')}</h4>
            <nav className="space-y-2">
              {[
                { key: 'home', href: '#inicio', label: t('common.home') },
                { key: 'rooms', href: '#habitaciones', label: t('common.rooms') },
                { key: 'gallery', href: '#galeria', label: t('common.gallery') },
                { key: 'reserve', href: '#reservar', label: t('common.reserve') },
                { key: 'contact', href: '#contacto', label: t('common.contact') },
              ].map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="block font-body text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-lg mb-4">{t('footer.follow')}</h4>
            <div className="flex gap-4">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 bg-cream/10 rounded-full flex items-center justify-center hover:bg-cream/20 transition-colors"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 pt-8 text-center">
          <p className="font-body text-xs text-cream/50">
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
