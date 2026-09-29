import React from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, MapPin, Clock, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const PhotoShoots = () => {
  const { t } = useTranslation();

  const { currentUser, bookings } = useApp();

  // Filter bookings for the current photographer
  const myBookings = bookings.filter(b => b.photographer_id === currentUser?.photographer_id);
  
  // For demo purposes, we'll just show the first 2 confirmed bookings as "Today's Shoots"
  const todaysShoots = myBookings.filter(b => b.booking_status === 'Confirmed').slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoShoots.todaySShoots')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoShoots.yourItineraryForT')}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 text-emerald-400">
          <Camera className="w-5 h-5" />
          <span className="font-bold">{todaysShoots.length} Sessions</span>
        </div>
      </div>

      {todaysShoots.length === 0 ? (
        <div className="text-center py-24 glass-card border border-slate-700/60 rounded-3xl">
          <Camera className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('photoShoots.noShootsToday')}</h3>
          <p className="text-sm text-slate-400 font-light">{t('photoShoots.enjoyYourDayOffO')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {todaysShoots.map((shoot, idx) => (
            <div key={shoot.booking_id} className="glass-card overflow-hidden border border-slate-700/60 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex flex-col md:flex-row">
                
                {/* Time Strip */}
                <div className="bg-slate-900 md:w-48 p-6 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-slate-800/80">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2">{t('photoShoots.schedule')}</span>
                  <div className="flex items-center gap-2 md:gap-0 md:flex-col text-center md:text-left">
                    <span className="text-3xl font-black text-white font-serif">{shoot.booking_time}</span>
                    <span className="text-sm text-slate-400 font-medium">{shoot.booking_date}</span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">
                        {shoot.event_id}
                      </span>
                      <h3 className="text-2xl font-bold text-white font-serif">{t('photoShoots.shootShootBookin')}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <span className="font-bold text-slate-400">{t('photoShoots.jD')}</span> {/* Mock initials */}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('photoShoots.location')}</p>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">{shoot.location}</p>
                      </div>
                    </div>
                    
                    {shoot.special_requirements && (
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs text-slate-400 font-bold">i</span>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t('photoShoots.notes')}</p>
                          <p className="text-sm text-slate-400 font-light italic">{shoot.special_requirements}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-800/80">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-colors">
                      <MapPin className="w-4 h-4" /> Get Directions
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-slate-700">
                      <MessageSquare className="w-4 h-4" /> Message Client
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-emerald-500/20 ml-auto">
                      <CheckCircle className="w-4 h-4" /> Mark Completed
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
