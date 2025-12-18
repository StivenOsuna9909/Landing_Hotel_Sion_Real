import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle, MessageSquare, User, Mail, Phone } from 'lucide-react';
import Header from '@/components/hotel/Header';
import Footer from '@/components/hotel/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { submitPQRS } from '@/services/pqrs';
import { useToast } from '@/hooks/use-toast';

const PQRS = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: 'peticion' as 'peticion' | 'queja' | 'reclamo' | 'sugerencia',
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitPQRS({
        type: formData.type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      setIsSubmitted(true);
      toast({
        title: t('pqrs.success.title'),
        description: t('pqrs.success.description'),
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          type: 'peticion',
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error al enviar PQRS:', error);
      toast({
        title: t('pqrs.error.title'),
        description: t('pqrs.error.description'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-padding pt-32">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="text-primary" size={32} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              {t('pqrs.title')}
            </h1>
            <p className="font-body text-muted-foreground text-lg">
              {t('pqrs.subtitle')}
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-card rounded-xl shadow-elegant p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
                <CheckCircle className="text-green-500" size={48} />
              </div>
              <h2 className="font-display text-2xl text-foreground">
                {t('pqrs.success.title')}
              </h2>
              <p className="font-body text-muted-foreground">
                {t('pqrs.success.description')}
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-xl shadow-elegant p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de PQRS */}
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-2">
                    {t('pqrs.form.type')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="peticion">{t('pqrs.types.peticion')}</option>
                    <option value="queja">{t('pqrs.types.queja')}</option>
                    <option value="reclamo">{t('pqrs.types.reclamo')}</option>
                    <option value="sugerencia">{t('pqrs.types.sugerencia')}</option>
                  </select>
                </div>

                {/* Nombre */}
                <div>
                  <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                    <User size={16} />
                    {t('pqrs.form.name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('pqrs.form.namePlaceholder')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                    <Mail size={16} />
                    {t('pqrs.form.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('pqrs.form.emailPlaceholder')}
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                    <Phone size={16} />
                    {t('pqrs.form.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('pqrs.form.phonePlaceholder')}
                  />
                </div>

                {/* Asunto */}
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-2">
                    {t('pqrs.form.subject')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('pqrs.form.subjectPlaceholder')}
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-2">
                    {t('pqrs.form.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder={t('pqrs.form.messagePlaceholder')}
                  />
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-gold rounded-lg px-6 py-3 font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {t('pqrs.form.submitting')}
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        {t('pqrs.form.submit')}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-6 py-3 rounded-lg border border-input bg-background hover:bg-secondary transition-colors font-body"
                  >
                    {t('pqrs.form.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PQRS;

