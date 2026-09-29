import React from 'react';
import { Check, Calendar, Clock, DollarSign, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const PackagesSection = () => {
  const { packages, photographers, setActiveBookingModal } = useApp();
  const { t } = useTranslation();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          {t('packages.transparentPricing')}
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {t('packages.title')}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {t('packages.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => {
          const photographer = photographers.find(p => p.photographer_id === pkg.photographer_id);
          const featuresList = pkg.features ? pkg.features.split(',').map(f => f.trim()) : [];

          return (
            <div
              key={pkg.package_id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl relative group"
            >
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                    {photographer ? photographer.name : t('packages.proPackage')}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pkg.duration_hours} {t('packages.hours')}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <p className="text-3xl font-extrabold text-amber-400 flex items-baseline gap-1">
                    <span>₹{pkg.price}</span>
                    <span className="text-xs text-slate-400 font-normal">{t('packages.perPackage')}</span>
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t('packages.highlights')}</p>
                  {featuresList.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setActiveBookingModal({
                    open: true,
                    photographer_id: pkg.photographer_id,
                    package_id: pkg.package_id,
                    step: 1
                  })}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('packages.bookNow')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
