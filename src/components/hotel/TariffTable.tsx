import React from 'react';
import { tariffs } from '@/data/tariffs';
import { useTranslation } from '@/hooks/useTranslation';

const TariffTable = () => {
  const { t } = useTranslation();
  
  return (
    <section id="tarifas" className="section-padding bg-secondary">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t('tariff.title')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            {t('tariff.subtitle')}
          </h2>
          <p className="font-body text-muted-foreground">
            {t('tariff.description')}
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-elegant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left font-display text-lg">{t('tariff.category')}</th>
                  <th className="px-6 py-4 text-left font-display text-lg">{t('tariff.type')}</th>
                  <th className="px-6 py-4 text-right font-display text-lg">{t('tariff.pricePerNight')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tariffs.map((tariff, index) => (
                  <React.Fragment key={index}>
                    {tariff.options.map((option, optIndex) => (
                      <tr
                        key={`${index}-${optIndex}`}
                        className="hover:bg-secondary/50 transition-colors"
                      >
                        {optIndex === 0 && (
                          <td
                            className="px-6 py-4 font-display text-foreground font-medium align-top"
                            rowSpan={tariff.options.length}
                          >
                            {t(`tariff.categories.${tariff.category}`)}
                          </td>
                        )}
                        <td className="px-6 py-4 font-body text-muted-foreground">
                          {t(`tariff.types.${option.type}`)}
                          {option.note && (
                            <span className="block text-xs text-muted-foreground/70 mt-1">
                              {t(`tariff.notes.${option.note}`)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-body text-foreground font-medium">
                          COP ${option.price.toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TariffTable;
