import React from 'react';
import { Camera, ShieldCheck, Award, Users, HeartHandshake } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          {t('about.subtitle')}
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {t('about.title')}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {t('about.desc')}
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">{t('about.f1Title')}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('about.f1Desc')}
          </p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">{t('about.f2Title')}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('about.f2Desc')}
          </p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">{t('about.f3Title')}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('about.f3Desc')}
          </p>
        </div>
      </div>

    </div>
  );
};
