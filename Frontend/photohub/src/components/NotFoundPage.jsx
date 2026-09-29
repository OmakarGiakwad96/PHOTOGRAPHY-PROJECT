import React from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
  const { navigateToTab } = useApp();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <span className="text-[40vw] font-black">404</span>
      </div>
      
      <div className="max-w-md w-full glass-card p-12 text-center space-y-8 relative z-10 animate-fade-in border-rose-500/20">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/30 text-rose-400 animate-pulse">
          <Camera className="w-10 h-10" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-serif font-bold text-white">{t('notfound.title')}</h1>
          <p className="text-slate-400 font-light">
            {t('notfound.desc')}
          </p>
        </div>

        <button
          onClick={() => navigateToTab('home')}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl mx-auto transition shadow-lg shadow-amber-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('notfound.returnHome')}</span>
        </button>
      </div>
    </div>
  );
};
