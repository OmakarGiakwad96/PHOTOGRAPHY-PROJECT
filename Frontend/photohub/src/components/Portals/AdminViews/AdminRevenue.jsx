import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, TrendingDown, Download, Activity, Calendar } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AdminRevenue = () => {
  const { t } = useTranslation();

  const { bookings } = useApp();

  // Aggregate stats from bookings (using total_price as a mock for revenue)
  const totalRevenue = bookings.filter(b => b.booking_status === 'Completed').reduce((sum, b) => sum + b.total_price, 0);
  const platformFee = totalRevenue * 0.15; // Mock 15% platform fee
  
  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminRevenue.revenueDashboard')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminRevenue.platformWideFinanc')}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-700/50 transition-colors">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 font-medium text-sm">{t('adminRevenue.thisMonth')}</span>
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm shadow-lg shadow-indigo-500/20">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
            <DollarSign className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('adminRevenue.grossVolumeGMV')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white font-serif">₹{totalRevenue.toLocaleString()}</h3>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% from last month
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('adminRevenue.netRevenue15Fee')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white font-serif">₹{platformFee.toLocaleString()}</h3>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% from last month
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-rose-500/20 transition-colors" />
          <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 border border-rose-500/20">
            <TrendingDown className="w-6 h-6 text-rose-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('adminRevenue.refundsChargeback')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white font-serif">₹24,500</h3>
          </div>
          <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> -2% from last month
          </p>
        </div>
      </div>

      <div className="glass-card border border-slate-700/60 rounded-3xl overflow-hidden p-6 h-96 flex flex-col items-center justify-center text-center">
        <Activity className="w-16 h-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('adminRevenue.revenueGrowthChart')}</h3>
        <p className="text-slate-400 text-sm max-w-sm">{t('adminRevenue.interactiveVisualiz')}</p>
      </div>
    </div>
  );
};
