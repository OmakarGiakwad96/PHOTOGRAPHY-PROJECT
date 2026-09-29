import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const ClientInvoices = () => {
  const { t } = useTranslation();

  const { currentUser, bookings, payments } = useApp();

  const clientBookings = bookings.filter(b => b.user_id === currentUser.user_id);
  const clientPayments = payments.filter(p => clientBookings.some(b => b.booking_id === p.booking_id && p.payment_status === 'Completed'));

  const handleDownload = (paymentId) => {

    alert(`Downloading invoice for transaction ${paymentId}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientInvoices.invoices')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientInvoices.downloadPDFInvoice')}</p>
        </div>
      </div>

      {clientPayments.length === 0 ? (
        <div className="text-center py-24 glass-card border border-slate-700/60 rounded-3xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('clientInvoices.allCaughtUp')}</h3>
          <p className="text-sm text-slate-400 font-light">{t('clientInvoices.youDonTHaveAnyP')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clientPayments.map((p, idx) => {
            const booking = clientBookings.find(b => b.booking_id === p.booking_id);
            return (
              <div key={p.payment_id} className="glass-card p-6 border border-slate-700/60 hover:border-amber-500/30 transition-all group animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => handleDownload(p.payment_id)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{`Invoice #${p.payment_id}`}</h3>
                <p className="text-sm text-slate-400 mb-4">{p.payment_date}</p>
                
                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('clientInvoices.event')}</p>
                    <p className="text-slate-300 text-sm font-medium">{booking?.event_id || 'Photography Service'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('clientInvoices.amount')}</p>
                    <p className="text-amber-400 font-extrabold font-serif text-lg">₹{p.amount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
