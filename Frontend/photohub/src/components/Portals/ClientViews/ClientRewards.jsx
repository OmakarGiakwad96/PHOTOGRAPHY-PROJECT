import React from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, Award, TrendingUp, Sparkles } from 'lucide-react';

export const ClientRewards = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientRewards.rewards')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientRewards.earnPointsOnEvery')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-amber-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <p className="text-amber-900 font-bold uppercase tracking-widest text-xs mb-2">{t('clientRewards.availablePoints')}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-6xl font-black text-slate-900 font-serif">2,450</h3>
                  <span className="text-amber-900 font-bold">{t('clientRewards.pts')}</span>
                </div>
              </div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center shrink-0">
                <Gift className="w-10 h-10 text-slate-900" />
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-amber-900/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-amber-900 font-bold text-sm">{t('clientRewards.goldTier')}</span>
                <span className="text-amber-900 font-bold text-sm">{t('clientRewards.550PtsToPlatinum')}</span>
              </div>
              <div className="w-full h-3 bg-amber-900/10 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 w-[80%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border border-slate-700/60">
            <h3 className="text-lg font-bold text-white mb-6 font-serif">{t('clientRewards.recentActivity')}</h3>
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t('clientRewards.bookingCompleted')}</h4>
                    <p className="text-sm text-slate-400">{t('clientRewards.preWeddingShoot')}</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-400">{t('clientRewards.500Pts')}</span>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t('clientRewards.profileVerified')}</h4>
                    <p className="text-sm text-slate-400">{t('clientRewards.oneTimeBonus')}</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-400">{t('clientRewards.200Pts')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border border-slate-700/60 bg-slate-900/40">
            <h3 className="text-lg font-bold text-white mb-4 font-serif">{t('clientRewards.redeemPoints')}</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-700 hover:border-amber-500/50 bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-semibold text-white">{t('clientRewards.500Discount')}</span>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">{t('clientRewards.100Pts')}</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-700 hover:border-amber-500/50 bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-semibold text-white">{t('clientRewards.1500Discount')}</span>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">{t('clientRewards.2500Pts')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
