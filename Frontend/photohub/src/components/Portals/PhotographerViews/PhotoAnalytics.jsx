import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, Eye, MousePointerClick, Heart, TrendingUp } from 'lucide-react';

export const PhotoAnalytics = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoAnalytics.analytics')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoAnalytics.understandYourProf')}</p>
        </div>
        <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500">
          <option>{t('photoAnalytics.last30Days')}</option>
          <option>{t('photoAnalytics.last3Months')}</option>
          <option>{t('photoAnalytics.thisYear')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Profile Views', value: '2,451', change: '+14%', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Search Appearances', value: '8,192', change: '+5%', icon: BarChart2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Booking Rate', value: '4.2%', change: '+1.1%', icon: MousePointerClick, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'New Saves', value: '143', change: '+22%', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 border border-slate-700/60 rounded-3xl group">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-white font-serif">{stat.value}</h3>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 border border-slate-700/60 rounded-3xl h-96 flex flex-col items-center justify-center text-center">
        <BarChart2 className="w-16 h-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('photoAnalytics.advancedAnalyticsC')}</h3>
        <p className="text-slate-400 text-sm max-w-sm">{t('photoAnalytics.interactiveVisualiz')}</p>
      </div>
    </div>
  );
};
