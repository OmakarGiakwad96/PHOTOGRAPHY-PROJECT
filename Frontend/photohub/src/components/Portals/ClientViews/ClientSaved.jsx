import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bookmark, Star, MapPin, CheckCircle, Search, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const ClientSaved = () => {
  const { t } = useTranslation();

  const { photographers, navigateToTab } = useApp();
  // Mock saved photographers for demonstration
  const [saved, setSaved] = useState(photographers.slice(0, 4));

  const removeSaved = (id, e) => {

    e.stopPropagation();
    setSaved(saved.filter(p => p.photographer_id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientSaved.savedPhotographers')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientSaved.yourCuratedListOf')}</p>
        </div>
        <button 
          onClick={() => navigateToTab('photographers')}
          className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-700/50 transition-colors"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-medium text-sm">{t('clientSaved.findMore')}</span>
        </button>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-24 glass-card border border-slate-700/60 rounded-3xl">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('clientSaved.noSavedProfessiona')}</h3>
          <p className="text-sm text-slate-400 font-light max-w-sm mx-auto">{t('clientSaved.youHavenTSavedAn')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {saved.map((p, idx) => (
            <div 
              key={p.photographer_id} 
              onClick={() => navigateToTab('profile', null, { id: p.photographer_id })}
              className="glass-card overflow-hidden hover:-translate-y-1 hover:shadow-amber-500/10 transition-all duration-300 group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="relative h-48 w-full">
                <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <button 
                  onClick={(e) => removeSaved(p.photographer_id, e)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-colors shadow-xl z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-serif truncate">{p.name}</h3>
                      {p.is_verified && <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-light truncate">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{p.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">{p.rating}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-end justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    {p.specialties?.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-slate-800 rounded text-slate-300 font-medium">{s}</span>
                    ))}
                    {p.specialties?.length > 2 && <span className="text-[10px] px-1.5 py-1 text-slate-500">+{p.specialties.length - 2}</span>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-amber-400 font-extrabold font-serif">₹{p.price_per_hour}<span className="text-[10px] text-slate-500 font-sans font-normal ml-0.5">{t('clientSaved.Hr')}</span></p>
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
