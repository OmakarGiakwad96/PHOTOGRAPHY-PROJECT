import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import ClientDeliveryPortal from '../../ClientDeliveryPortal';

export const ClientAlbums = () => {
  const { t } = useTranslation();

  const { bookings } = useApp();
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Mock past bookings that might have an album
  const completedBookings = bookings.filter(b => b.booking_status === 'Confirmed' || b.booking_status === 'Completed');

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientAlbums.downloadedAlbums')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientAlbums.viewAndDownloadHi')}</p>
        </div>
        
        {selectedBookingId && (
          <button 
            onClick={() => setSelectedBookingId(null)}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-semibold"
          >
            Back to Album List
          </button>
        )}
      </div>

      {!selectedBookingId ? (
        <>
          {completedBookings.length === 0 ? (
            <div className="text-center py-24 glass-card border border-slate-700/60 rounded-3xl">
              <Download className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('clientAlbums.noAlbumsYet')}</h3>
              <p className="text-sm text-slate-400 font-light">{t('clientAlbums.completeABookingT')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedBookings.map((b, idx) => (
                <div 
                  key={b.booking_id}
                  onClick={() => setSelectedBookingId(b.booking_id)}
                  className="glass-card p-6 border border-slate-700/60 hover:border-amber-500/30 transition-all cursor-pointer group animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                        <ImageIcon className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-serif">
                          {b.event_id || 'Photography Session'}
                        </h3>
                        <p className="text-xs text-slate-400">{b.booking_date}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-xl p-4 flex items-center justify-between border border-slate-800/50 group-hover:border-slate-700 transition-colors">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('clientAlbums.status')}</p>
                      <p className="text-sm font-semibold text-emerald-400">{t('clientAlbums.readyForDownload')}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                      <Download className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-200 p-1 rounded-3xl overflow-hidden shadow-2xl">
          <ClientDeliveryPortal bookingId={selectedBookingId} token="demo-token" />
        </div>
      )}
    </div>
  );
};
