import React from 'react';
import { useTranslation } from 'react-i18next';

export const LegalPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0b0e14] py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-white">{t('legal.title')}</h1>
          <p className="text-slate-400 text-sm">{t('legal.lastUpdated')}</p>
        </div>

        <div className="space-y-8 glass-card p-8 text-slate-300">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">{t('legal.section1Title')}</h2>
            <p className="font-light leading-relaxed">
              {t('legal.section1Desc')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">{t('legal.section2Title')}</h2>
            <p className="font-light leading-relaxed">
              {t('legal.section2Desc')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">{t('legal.section3Title')}</h2>
            <p className="font-light leading-relaxed">
              {t('legal.section3Desc')}
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};
