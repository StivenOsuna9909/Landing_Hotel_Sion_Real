import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Home, Check } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { getTariffOptions } from '@/data/tariffs';

interface FormErrors {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  room?: string;
}

const BookingForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const tariffOptions = useMemo(() => {
    return getTariffOptions().map(option => ({
      ...option,
      name: `${t(`tariff.categories.${option.categoryKey}`)} - ${t(`tariff.types.${option.typeKey}`)}${option.noteKey ? ` (${t(`tariff.notes.${option.noteKey}`)})` : ''}`
    }));
  }, [t]);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    children: '0',
    room: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.checkIn) {
      newErrors.checkIn = t('booking.errors.checkInRequired');
    } else {
      const todayStr = today.toISOString().split('T')[0];
      if (formData.checkIn < todayStr) {
        newErrors.checkIn = t('booking.errors.checkInPast');
      }
    }

    if (!formData.checkOut) {
      newErrors.checkOut = t('booking.errors.checkOutRequired');
    } else if (formData.checkIn && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      newErrors.checkOut = t('booking.errors.checkOutBefore');
    }

    if (!formData.guests || parseInt(formData.guests) < 1) {
      newErrors.guests = t('booking.errors.guestsMin');
    } else if (parseInt(formData.guests) > 10) {
      newErrors.guests = t('booking.errors.guestsMax');
    }

    if (!formData.room) {
      newErrors.room = t('booking.errors.roomRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.room) return null;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;
    const tariff = tariffOptions.find((t) => t.id === formData.room);
    if (!tariff) return null;
    return { nights, pricePerNight: tariff.price, total: nights * tariff.price };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const total = calculateTotal();
    if (!total) {
      setIsSubmitting(false);
      return;
    }

    const tariff = tariffOptions.find((t) => t.id === formData.room);
    if (!tariff) {
      setIsSubmitting(false);
      return;
    }

    // Redirigir a checkout con los datos de la reserva
    navigate('/checkout', {
      state: {
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        children: formData.children,
        room: formData.room,
        nights: total.nights,
        pricePerNight: total.pricePerNight,
        total: total.total,
        roomName: tariff.name,
      },
    });

    setIsSubmitting(false);
  };

  const total = calculateTotal();

  return (
    <section id="reservar" className="section-padding bg-cream-dark">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t('common.reserve')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            {t('booking.title')}
          </h2>
          <p className="font-body text-muted-foreground">
            {t('booking.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-elegant p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Check-in Date */}
            <div>
              <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                <Calendar size={16} />
                {t('booking.checkIn')}
              </label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, checkIn: value });
                  // Validar en tiempo real
                  if (value) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const todayStr = today.toISOString().split('T')[0];
                    if (value < todayStr) {
                      setErrors({ ...errors, checkIn: t('booking.errors.checkInPast') });
                    } else {
                      setErrors({ ...errors, checkIn: undefined });
                    }
                  } else {
                    setErrors({ ...errors, checkIn: undefined });
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.checkIn ? 'border-destructive' : 'border-input'
                }`}
              />
              {errors.checkIn && (
                <p className="text-destructive text-xs mt-1">{errors.checkIn}</p>
              )}
            </div>

            {/* Check-out Date */}
            <div>
              <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                <Calendar size={16} />
                {t('booking.checkOut')}
              </label>
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.checkOut ? 'border-destructive' : 'border-input'
                }`}
              />
              {errors.checkOut && (
                <p className="text-destructive text-xs mt-1">{errors.checkOut}</p>
              )}
            </div>

            {/* Number of Guests (Adults) */}
            <div>
              <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                <Users size={16} />
                {t('booking.guests')} ({t('booking.adults')})
              </label>
              <select
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.guests ? 'border-destructive' : 'border-input'
                }`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? t('booking.adult') : t('booking.adults')}
                  </option>
                ))}
              </select>
              {errors.guests && (
                <p className="text-destructive text-xs mt-1">{errors.guests}</p>
              )}
            </div>

            {/* Number of Children */}
            <div>
              <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                <Users size={16} />
                {t('booking.children')}
              </label>
              <select
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 0 ? t('booking.noChildren') : num === 1 ? t('booking.child') : t('booking.children')}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Selection */}
            <div>
              <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                <Home size={16} />
                {t('booking.roomType')}
              </label>
              <select
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.room ? 'border-destructive' : 'border-input'
                }`}
              >
                <option value="">{t('booking.roomType')}</option>
                {tariffOptions.map((tariff) => (
                  <option key={tariff.id} value={tariff.id}>
                    {tariff.name} - COP ${tariff.price.toLocaleString('es-CO')}/noche
                  </option>
                ))}
              </select>
              {errors.room && (
                <p className="text-destructive text-xs mt-1">{errors.room}</p>
              )}
            </div>
          </div>

          {/* Price Summary */}
          {total && (
            <div className="bg-secondary rounded-lg p-6 mb-8">
              <h4 className="font-display text-lg text-foreground mb-4">{t('booking.title')}</h4>
              <div className="space-y-2 font-body text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{total.nights} {t('booking.nights')} x COP ${total.pricePerNight.toLocaleString('es-CO')}</span>
                  <span>COP ${total.total.toLocaleString('es-CO')}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-medium text-foreground">
                  <span>{t('booking.total')}</span>
                  <span className="text-xl">COP ${total.total.toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Check size={18} />
                {t('booking.confirmReservation')}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
