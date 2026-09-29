import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, IndianRupee } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const ClientBookings = () => {
  const { t } = useTranslation();

  const { currentUser, bookings, photographers, cancelBooking } = useApp();

  const clientBookings = bookings.filter(b => b.user_id === currentUser.user_id);

  const handleCancel = (bookingId) => {

    const reason = prompt("Please enter a reason for cancellation:");
    if (reason) {
      cancelBooking(bookingId, reason);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientBookings.myBookings')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientBookings.manageYourUpcoming')}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800/50">
          <Calendar className="w-5 h-5 text-amber-500" />
          <span className="text-white font-bold">{clientBookings.length} Active</span>
        </div>
      </div>

      {clientBookings.length === 0 ? (
        <div className="text-center py-24 glass-card border border-slate-700/60 rounded-3xl">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('clientBookings.noActiveBookings')}</h3>
          <p className="text-sm text-slate-400 font-light max-w-sm mx-auto">{t('clientBookings.youHavenTBookedA')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {clientBookings.map((b, idx) => {
            const photographer = photographers.find(p => p.photographer_id === b.photographer_id);
            return (
              <div key={b.booking_id} className="glass-card p-6 sm:p-8 border border-slate-700/60 space-y-6 hover:border-amber-500/30 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                  <div>
                    <span className="text-sm font-bold text-amber-400 uppercase tracking-widest">{t('clientBookings.bookingBBooking')}</span>
                    <span className="mx-3 text-slate-700">•</span>
                    <span className="text-xs text-slate-500 font-mono">{t('clientBookings.eVENTBEventid')}</span>
                  </div>
                  <span className={`self-start sm:self-auto px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner ${
                    b.booking_status === 'Confirmed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    b.booking_status === 'Cancelled' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                    'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  }`}>
                    {b.booking_status}
                  </span>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pro Info */}
                  <div className="flex items-center gap-4">
                    <img src={photographer?.cover_image || "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg"} alt={photographer?.name} className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('clientBookings.professional')}</p>
                      <p className="text-white font-bold font-serif text-lg leading-tight">{photographer?.name || 'Assigned Pro'}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('clientBookings.dateTime')}</p>
                      <p className="text-slate-200 font-medium text-sm">{b.booking_date}</p>
                      <p className="text-slate-400 text-xs">{b.booking_time}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
                      <IndianRupee className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('clientBookings.totalPrice')}</p>
                      <p className="text-amber-400 font-extrabold font-serif text-xl">₹{b.total_price}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800/50 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300 font-light leading-relaxed">{b.location}</p>
                  </div>
                  {b.special_requirements && (
                    <div className="flex items-start gap-3 pt-3 border-t border-slate-800/50">
                      <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-bold">i</span>
                      </div>
                      <p className="text-sm text-slate-400 font-light italic">{b.special_requirements}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {b.booking_status === 'Confirmed' && (
                  <div className="pt-4 border-t border-slate-800/80 flex justify-end">
                    <button 
                      onClick={() => handleCancel(b.booking_id)}
                      className="px-6 py-2.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-semibold"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
