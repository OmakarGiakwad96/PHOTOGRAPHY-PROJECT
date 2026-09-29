import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, Users, Camera, DollarSign, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAnalytics = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState(t('adminAnalytics.allTime'));

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
    toast(`Updating analytics for ${e.target.value}...`, { icon: '📊', style: { background: '#1e293b', color: '#fff' } });
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminAnalytics.platformAnalytics')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminAnalytics.deepDiveIntoUser')}</p>
        </div>
        <select 
          value={period}
          onChange={handlePeriodChange}
          className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value={t('adminAnalytics.last30Days')}>{t('adminAnalytics.last30Days')}</option>
          <option value={t('adminAnalytics.lastQuarter')}>{t('adminAnalytics.lastQuarter')}</option>
          <option value={t('adminAnalytics.yearToDate')}>{t('adminAnalytics.yearToDate')}</option>
          <option value={t('adminAnalytics.allTime')}>{t('adminAnalytics.allTime')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Clients', value: '14,205', change: '+8%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Active Photographers', value: '1,842', change: '+12%', icon: Camera, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Avg. Booking Value', value: '₹18,500', change: '+3%', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Platform Conversion', value: '4.8%', change: '+0.5%', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 border border-slate-700/60 rounded-3xl group">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-white font-serif">{stat.value}</h3>
            <p className={`text-xs mt-2 font-medium ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stat.change} <span className="text-slate-500 font-normal">{t('adminAnalytics.vsLastPeriod')}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-slate-700/60 rounded-3xl lg:col-span-2 h-96 flex flex-col items-center justify-center text-center">
          <BarChart2 className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('adminAnalytics.growthTrajectory')}</h3>
          <p className="text-slate-400 text-sm max-w-sm">{t('adminAnalytics.primaryVisualizatio')}</p>
        </div>

        <div className="glass-card p-6 border border-slate-700/60 rounded-3xl h-96 flex flex-col">
          <h3 className="font-bold text-white mb-6 font-serif">{t('adminAnalytics.topCategories')}</h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {[
              { name: 'Wedding', percent: 45, color: 'bg-indigo-500' },
              { name: 'Pre-Wedding', percent: 25, color: 'bg-emerald-500' },
              { name: 'Maternity', percent: 15, color: 'bg-amber-500' },
              { name: 'Corporate', percent: 15, color: 'bg-blue-500' },
            ].map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="text-slate-400">{cat.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
