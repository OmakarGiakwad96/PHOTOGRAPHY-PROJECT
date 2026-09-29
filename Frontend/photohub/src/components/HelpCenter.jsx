import React from 'react';
import { HelpCircle, FileText, Camera, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const HelpCenter = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0b0e14] py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        
        <div className="text-center space-y-4">
          <HelpCircle className="w-16 h-16 text-amber-500 mx-auto" />
          <h1 className="text-4xl font-serif font-bold text-white">{t('helpCenter.title')}</h1>
          <p className="text-slate-400">{t('helpCenter.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4 hover:border-amber-500/30 transition">
            <div className="flex items-center gap-3 text-amber-400">
              <Camera className="w-6 h-6" />
              <h3 className="font-bold text-lg">{t('helpCenter.forClients')}</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <details className="group cursor-pointer">
                <summary className="font-semibold outline-none group-open:text-amber-400 transition-colors">{t('helpCenter.faq1Q')}</summary>
                <p className="mt-2 text-slate-400 font-light pl-4 border-l-2 border-slate-800">{t('helpCenter.faq1A')}</p>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-semibold outline-none group-open:text-amber-400 transition-colors">{t('helpCenter.faq2Q')}</summary>
                <p className="mt-2 text-slate-400 font-light pl-4 border-l-2 border-slate-800">{t('helpCenter.faq2A')}</p>
              </details>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 hover:border-amber-500/30 transition">
            <div className="flex items-center gap-3 text-amber-400">
              <CreditCard className="w-6 h-6" />
              <h3 className="font-bold text-lg">{t('helpCenter.billingPayments')}</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <details className="group cursor-pointer">
                <summary className="font-semibold outline-none group-open:text-amber-400 transition-colors">{t('helpCenter.faq3Q')}</summary>
                <p className="mt-2 text-slate-400 font-light pl-4 border-l-2 border-slate-800">{t('helpCenter.faq3A')}</p>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-semibold outline-none group-open:text-amber-400 transition-colors">{t('helpCenter.faq4Q')}</summary>
                <p className="mt-2 text-slate-400 font-light pl-4 border-l-2 border-slate-800">{t('helpCenter.faq4A')}</p>
              </details>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
