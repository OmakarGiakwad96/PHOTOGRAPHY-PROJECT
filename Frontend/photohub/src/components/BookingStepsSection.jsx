import React from 'react';
import { UserCheck, Calendar, Sliders, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const BookingStepsSection = () => {
  const { setActiveBookingModal } = useApp();
  const { t } = useTranslation();

  const steps = [
    {
      step: '01',
      titleKey: 'steps.s1Title',
      descKey: 'steps.s1Desc',
      icon: UserCheck,
    },
    {
      step: '02',
      titleKey: 'steps.s2Title',
      descKey: 'steps.s2Desc',
      icon: Calendar,
    },
    {
      step: '03',
      titleKey: 'steps.s3Title',
      descKey: 'steps.s3Desc',
      icon: Sliders,
    },
    {
      step: '04',
      titleKey: 'steps.s4Title',
      descKey: 'steps.s4Desc',
      icon: CreditCard,
    },
  ];

  return (
    <section className="py-24 bg-slate-950/60 border-t border-slate-800/80 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-20 animate-slide-up">
          <p className="section-label">
            {t('steps.simpleSeamless')}
          </p>
          <h2 className="section-heading font-serif">
            {t('steps.title')}
          </h2>
          <p className="text-slate-400 text-base font-light">
            {t('steps.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative glass-card p-8 hover:border-amber-500/40 transition-all duration-500 space-y-6 text-left group hover:-translate-y-2 hover:shadow-amber-500/10 animate-slide-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shadow-inner group-hover:bg-amber-500/20 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-serif font-black text-slate-600/50 group-hover:text-amber-500/20 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-serif leading-snug">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => setActiveBookingModal({ open: true, step: 1 })}
            className="btn-amber text-base px-10 py-4 hover-shine"
          >
            {t('steps.startBooking')}
          </button>
        </div>

      </div>
    </section>
  );
};
