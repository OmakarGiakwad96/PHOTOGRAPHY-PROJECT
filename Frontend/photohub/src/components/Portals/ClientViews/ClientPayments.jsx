import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IndianRupee, RefreshCw, AlertCircle, Search, Filter } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const ClientPayments = () => {
  const { t } = useTranslation();

  const { currentUser, bookings, payments, refunds, paymentIssues, reportPaymentIssue } = useApp();
  const [activeTab, setActiveTab] = useState('history');
  
  const clientBookings = (bookings || []).filter(b => b.user_id === currentUser?.user_id);
  const clientPayments = (payments || []).filter(p => clientBookings.some(b => b.booking_id === p.booking_id));
  const clientRefunds = (refunds || []).filter(r => clientBookings.some(b => b.booking_id === r.booking_id));
  const clientIssues = (paymentIssues || []).filter(i => i.user_id === currentUser?.user_id);

  const [issueType, setIssueType] = useState('Double Charge Inquiry');
  const [issueDesc, setIssueDesc] = useState('');
  const [selectedPaymentForIssue, setSelectedPaymentForIssue] = useState(null);

  const handleIssueSubmit = (e) => {

    e.preventDefault();
    if (!selectedPaymentForIssue || !issueDesc) return;
    reportPaymentIssue(selectedPaymentForIssue.payment_id, issueType, issueDesc);
    alert(t('clientPayments.paymentIssueReport'));
    setSelectedPaymentForIssue(null);
    setIssueDesc('');
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientPayments.payments')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientPayments.viewYourPaymentHi')}</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-800/80 text-sm font-bold overflow-x-auto custom-scrollbar pb-px">
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'history' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>{t('clientPayments.paymentHistory')}</span>
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`pb-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'refunds' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t('clientPayments.refundRequests')}</span>
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`pb-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'issues' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{t('clientPayments.reportAnIssue')}</span>
        </button>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden">
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/50 text-slate-400 font-bold tracking-widest border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">{t('clientPayments.transactionID')}</th>
                  <th className="px-6 py-4">{t('clientPayments.date')}</th>
                  <th className="px-6 py-4">{t('clientPayments.bookingID')}</th>
                  <th className="px-6 py-4">{t('clientPayments.method')}</th>
                  <th className="px-6 py-4">{t('clientPayments.status')}</th>
                  <th className="px-6 py-4 text-right">{t('clientPayments.amount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {clientPayments.map((p) => (
                  <tr key={p.payment_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-amber-400">{p.payment_id}</td>
                    <td className="px-6 py-4">{p.payment_date}</td>
                    <td className="px-6 py-4">#{p.booking_id}</td>
                    <td className="px-6 py-4">{p.payment_method}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner ${
                        p.payment_status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        p.payment_status === 'Failed' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                        'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      }`}>
                        {p.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold font-serif text-white">₹{p.amount}</td>
                  </tr>
                ))}
                {clientPayments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-light">{t('clientPayments.noPaymentHistoryF')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/50 text-slate-400 font-bold tracking-widest border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">{t('clientPayments.refundID')}</th>
                  <th className="px-6 py-4">{t('clientPayments.date')}</th>
                  <th className="px-6 py-4">{t('clientPayments.bookingID')}</th>
                  <th className="px-6 py-4">{t('clientPayments.reason')}</th>
                  <th className="px-6 py-4">{t('clientPayments.status')}</th>
                  <th className="px-6 py-4 text-right">{t('clientPayments.amount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {clientRefunds.map((r) => (
                  <tr key={r.refund_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-amber-400">{r.refund_id}</td>
                    <td className="px-6 py-4">{r.request_date}</td>
                    <td className="px-6 py-4">#{r.booking_id}</td>
                    <td className="px-6 py-4 text-xs italic">{r.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner ${
                        r.refund_status === 'Processed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        r.refund_status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                        'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}>
                        {r.refund_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold font-serif text-white">₹{r.amount}</td>
                  </tr>
                ))}
                {clientRefunds.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-light">{t('clientPayments.noRefundRequestsF')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6 font-serif">{t('clientPayments.reportAPaymentIss')}</h3>
            <form onSubmit={handleIssueSubmit} className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('clientPayments.selectTransaction')}</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  value={selectedPaymentForIssue?.payment_id || ''}
                  onChange={(e) => {
                    if (e.target.value === 'demo_tx_1') {
                      setSelectedPaymentForIssue({ payment_id: 'demo_tx_1', amount: 5000, payment_date: 'Demo' });
                    } else {
                      setSelectedPaymentForIssue(clientPayments.find(p => p.payment_id.toString() === e.target.value));
                    }
                  }}
                  required
                >
                  <option value="">{t('clientPayments.chooseATransaction')}</option>
                  {clientPayments.map(p => (
                    <option key={p.payment_id} value={p.payment_id}>
                      {p.payment_id} - ₹{p.amount} ({p.paid_at})
                    </option>
                  ))}
                  {clientPayments.length === 0 && (
                    <option value="demo_tx_1">{t('clientPayments.dEMOTX15000D')}</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('clientPayments.issueType')}</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  <option>{t('clientPayments.doubleChargeInquir')}</option>
                  <option>{t('clientPayments.paymentNotReflecte')}</option>
                  <option>{t('clientPayments.refundNotReceived')}</option>
                  <option>{t('clientPayments.other')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('clientPayments.description')}</label>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none h-32 resize-none"
                  placeholder={t('clientPayments.provideDetailsAbou')}
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors">
                {t('clientPayments.submitReport')}
              </button>
            </form>

            {clientIssues.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6 font-serif">{t('clientPayments.previousReports')}</h3>
                <div className="space-y-4">
                  {clientIssues.map((i, idx) => (
                    <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-amber-400 font-bold mb-1">{i.issue_type}</p>
                        <p className="text-slate-300 text-sm">{i.description}</p>
                        <p className="text-slate-500 text-xs mt-2 font-mono">{t('clientPayments.refIPaymentid')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
