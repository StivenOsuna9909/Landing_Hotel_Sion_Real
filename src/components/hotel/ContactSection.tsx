import { MapPin, Phone, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const ContactSection = () => {
  const { t } = useTranslation();
  return (
    <section id="contacto" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t('common.contact')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            {t('contact.title')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-display text-xl text-foreground mb-2">{t('contact.address')}</h3>
                <p className="font-body text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('contact.addressValue') }} />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-display text-xl text-foreground mb-2">{t('contact.phone')}</h3>
                <a
                  href="tel:+573133505180"
                  className="font-body text-muted-foreground hover:text-primary transition-colors"
                >
                  (+57) 313 350 5180
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-display text-xl text-foreground mb-2">{t('contact.receptionHours')}</h3>
                <p className="font-body text-muted-foreground">
                  {t('contact.receptionHoursValue')}
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] lg:h-full min-h-[400px] rounded-xl overflow-hidden shadow-elegant">
            <iframe
              src="https://www.google.com/maps?q=Cl.+7+%233-25+Neiva+Huila+Colombia&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Hotel Sion Real - Cl. 7 # 3-25, Neiva, Huila"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
