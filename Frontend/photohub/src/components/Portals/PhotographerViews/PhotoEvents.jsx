import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, IndianRupee } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const PhotoEvents = () => {
  const { t } = useTranslation();

  const { currentUser, bookings } = useApp();

  const upcomingEvents = bookings.filter(b => b.photographer_id === currentUser?.photographer_id && b.booking_status === t('photoEvents.confirmed')).slice(2);

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoEvents.upcomingEvents')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoEvents.yourConfirmedFutur')}</p>
        </div>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="text-center py-24 glass-card border border-slate-700/60 rounded-3xl">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('photoEvents.noUpcomingEvents')}</h3>
          <p className="text-sm text-slate-400 font-light">{t('photoEvents.youHaveNoSchedule')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingEvents.map((event, idx) => (
            <div key={event.booking_id} className="glass-card p-6 sm:p-8 border border-slate-700/60 hover:border-amber-500/30 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t('photoEvents.sep')}</span>
                    <span className="text-lg font-black text-white">{10 + idx}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg font-serif">{event.event_id || 'Photo Session'}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {event.booking_time}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Confirmed
                </span>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">{event.location}</p>
                </div>
                
                <div className="flex justify-between items-end mt-4 pt-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0b0e14] flex items-center justify-center text-xs text-white font-bold">{t('photoEvents.jD')}</div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0b0e14] flex items-center justify-center text-xs text-slate-400 font-bold">+2</div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('photoEvents.expectedEarnings')}</p>
                    <p className="text-amber-400 font-extrabold font-serif text-lg">₹{event.total_price}</p>
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
