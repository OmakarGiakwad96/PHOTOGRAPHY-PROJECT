import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Search, Check, X, Clock, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AdminPayments = () => {
  const { t } = useTranslation();

  const { bookings } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter(b => {
    const isPending = b.booking_status === 'Confirmed';
    const isRefund = b.booking_status === 'Cancelled';
    
    if (activeTab === 'pending_payouts' && !isPending) return false;
    if (activeTab === 'refunds' && !isRefund) return false;
    
    return String(b.booking_id).includes(searchQuery);
  });

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminPayments.paymentsLedger')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminPayments.managePlatformTran')}</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('adminPayments.searchTXNID')} 
            className="w-full sm:w-64 bg-slate-900 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800/80 w-fit">
        {['all', 'pending_payouts', 'refunds'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {tab === 'all' ? 'All Transactions' : tab === 'pending_payouts' ? 'Pending Payouts' : 'Refund Requests'}
          </button>
        ))}
      </div>

      <div className="glass-card border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-bold tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-indigo-400 font-bold">TXN ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">{t('adminPayments.client')}</th>
                <th className="px-6 py-4">{t('adminPayments.photographer')}</th>
                <th className="px-6 py-4 text-right">{t('adminPayments.amountGross')}</th>
                <th className="px-6 py-4 text-right">{t('adminPayments.platformFee')}</th>
                <th className="px-6 py-4 text-right">{t('adminPayments.payoutStatus')}</th>
                <th className="px-6 py-4 text-center">{t('adminPayments.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
              {filteredBookings.length > 0 ? filteredBookings.map((b, idx) => {
                const fee = b.total_price * 0.15;
                const net = b.total_price - fee;
                const isPending = b.booking_status === 'Confirmed';
                const isRefund = b.booking_status === 'Cancelled';

                return (
                  <tr key={b.booking_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-indigo-400 font-bold">{`TXN-${b.booking_id}`}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{b.booking_date}</td>
                    <td className="px-6 py-4">{`User #${b.user_id}`}</td>
                    <td className="px-6 py-4">{`Pro #${b.photographer_id}`}</td>
                    <td className="px-6 py-4 text-right font-bold text-white">₹{b.total_price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-emerald-400 font-medium">₹{fee.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {isPending ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner bg-amber-500/10 border-amber-500/30 text-amber-400 flex items-center gap-1 justify-end w-fit ml-auto">
                          <Clock className="w-3 h-3" />
{t('adminPayments.hold')}
</span>
                      ) : isRefund ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner bg-rose-500/10 border-rose-500/30 text-rose-400">
{t('adminPayments.refunded')}
</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
{t('adminPayments.paidOut')}
</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {isPending && (
                          <button className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors border border-indigo-500/20" title={t('adminPayments.processPayout')}>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        )}
                        <button className="text-xs font-semibold text-slate-400 hover:text-white underline transition-colors">
{t('adminPayments.details')}
</button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No transactions found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
