import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Link, DollarSign, ArrowUpRight, Trophy } from 'lucide-react';
import { api } from '../../../utils/api';

export const AdminReferrals = () => {
  const { t } = useTranslation();

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    api.get('/admin/referrals').then(res => setLeaderboard(res.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminReferrals.referralProgram')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminReferrals.trackAffiliateLink')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border border-slate-700/60 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('adminReferrals.totalReferrals')}</p>
          <h3 className="text-2xl font-black text-white font-serif">1,204</h3>
        </div>
        
        <div className="glass-card p-6 border border-slate-700/60 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <Link className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('adminReferrals.activeLinks')}</p>
          <h3 className="text-2xl font-black text-white font-serif">452</h3>
        </div>

        <div className="glass-card p-6 border border-slate-700/60 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('adminReferrals.totalPaidOut')}</p>
          <h3 className="text-2xl font-black text-white font-serif">₹1,20,400</h3>
        </div>
      </div>

      <div className="glass-card border border-slate-700/60 rounded-3xl overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
          <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            {t('adminReferrals.referralLeaderboard')}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-bold tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4 text-center">Referred</th>
                <th className="px-6 py-4 text-right">Earnings</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
              {leaderboard.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{user.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-indigo-400 font-bold px-2 py-1 bg-indigo-500/10 rounded border border-indigo-500/20">{user.code}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-white">
                    {user.referred}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400">
                    {user.earnings}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors">
                      View Payouts
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
