import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, MapPin, Clock, Check, X, Calendar } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const PhotoRequests = () => {
  const { t } = useTranslation();

  const { currentUser, bookings, updateBookingStatus } = useApp();

  const pendingRequests = bookings.filter(b => b.photographer_id === currentUser?.photographer_id && b.booking_status === 'Pending');

  const handleAction = (id, status) => {

    updateBookingStatus(id, status);
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoRequests.bookingRequests')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoRequests.reviewAndRespondT')}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 text-amber-400">
          <Users className="w-5 h-5" />
          <span className="font-bold">{pendingRequests.length} Pending</span>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="text-center py-24 glass-card border border-slate-700/60 rounded-3xl">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('photoRequests.noPendingRequests')}</h3>
          <p className="text-sm text-slate-400 font-light max-w-sm mx-auto">{t('photoRequests.youReAllCaughtUp')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingRequests.map((req, idx) => (
            <div key={req.booking_id} className="glass-card overflow-hidden border border-slate-700/60 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex flex-col md:flex-row">
                
                {/* Client Info Strip */}
                <div className="bg-slate-900 md:w-64 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-800/80 relative">
                  <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 mb-4 overflow-hidden">
                    <img src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg" alt={t('photoRequests.client')} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{t('photoRequests.clientReqUserid')}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t('photoRequests.firstTimeClient')}</p>
                </div>

                {/* Main Content */}
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">
                        {req.event_id}
                      </span>
                      <h3 className="text-xl font-bold text-white font-serif">{t('photoRequests.requestReqBookin')}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('photoRequests.quote')}</p>
                      <p className="text-amber-400 font-extrabold font-serif text-xl">₹{req.total_price}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('photoRequests.dateTime')}</p>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">{req.booking_date} at {req.booking_time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('photoRequests.location')}</p>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">{req.location}</p>
                      </div>
                    </div>
                    
                    {req.special_requirements && (
                      <div className="flex items-start gap-3 sm:col-span-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 mt-2">
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs text-slate-400 font-bold">i</span>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('photoRequests.clientNotes')}</p>
                          <p className="text-sm text-slate-300 font-light italic leading-relaxed">{req.special_requirements}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-800/80">
                    <button 
                      onClick={() => handleAction(req.booking_id, 'Confirmed')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </button>
                    <button 
                      onClick={() => handleAction(req.booking_id, 'Cancelled')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-8 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-rose-500/20"
                    >
                      <X className="w-4 h-4" /> Decline
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-slate-700 sm:ml-auto">
                      Propose New Time
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
