import React from 'react';
import { useTranslation } from 'react-i18next';
import { IndianRupee, TrendingUp, Download, ArrowUpRight, Clock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const PhotoEarnings = () => {
  const { t } = useTranslation();

  const { currentUser, bookings } = useApp();

  const myBookings = bookings.filter(b => b.photographer_id === currentUser?.photographer_id && b.booking_status === 'Completed');
  const totalEarned = myBookings.reduce((sum, b) => sum + b.total_price, 0);

  // Mock pending clearance
  const pendingClearance = bookings
    .filter(b => b.photographer_id === currentUser?.photographer_id && b.booking_status === 'Confirmed')
    .reduce((sum, b) => sum + b.total_price, 0);

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoEarnings.earnings')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoEarnings.trackYourRevenueA')}</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-700/50 transition-colors">
          <Download className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-medium text-sm">{t('photoEarnings.downloadReport')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-colors" />
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 border border-amber-500/20">
            <IndianRupee className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('photoEarnings.totalEarnings')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white font-serif">₹{totalEarned}</h3>
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
            <Clock className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('photoEarnings.pendingClearance')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white font-serif">₹{pendingClearance}</h3>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Clearing in 3-5 days
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('photoEarnings.thisMonth')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white font-serif">₹{Math.round(totalEarned * 0.4)}</h3>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +12% from last month
          </p>
        </div>
      </div>

      <div className="glass-card border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/50">
          <h3 className="text-lg font-bold text-white font-serif">{t('photoEarnings.recentTransactions')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-bold tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">{t('photoEarnings.transactionID')}</th>
                <th className="px-6 py-4">{t('photoEarnings.date')}</th>
                <th className="px-6 py-4">{t('photoEarnings.client')}</th>
                <th className="px-6 py-4">{t('photoEarnings.status')}</th>
                <th className="px-6 py-4 text-right">{t('photoEarnings.amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
              {myBookings.map((b) => (
                <tr key={b.booking_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-amber-400">{`TXN-${b.booking_id}`}</td>
                  <td className="px-6 py-4">{b.booking_date}</td>
                  <td className="px-6 py-4">{`Client #${b.user_id}`}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                      Paid Out
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold font-serif text-white">₹{b.total_price}</td>
                </tr>
              ))}
              {myBookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-light">{t('photoEarnings.noEarningsHistory')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
