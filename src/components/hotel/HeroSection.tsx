import heroImage from '@/assets/hotel-hero.jpg';
import { useTranslation } from '@/hooks/useTranslation';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section id="inicio" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Hotel Sion Real - Hotel Boutique de lujo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-up">
        <p className="font-body text-sm md:text-base uppercase tracking-[0.3em] text-cream mb-6">
          {t('common.hotel')}
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream mb-6 leading-tight">
          {t('hero.title')}
        </h1>
        <p className="font-display text-xl md:text-2xl italic text-cream mb-12 drop-shadow-lg">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#reservar"
            className="btn-gold rounded"
          >
            {t('hero.reserveNow')}
          </a>
          <a
            href="#habitaciones"
            className="btn-outline-gold rounded border-cream text-cream hover:bg-cream hover:text-foreground"
          >
            {t('hero.viewRooms')}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream/60 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-cream/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
