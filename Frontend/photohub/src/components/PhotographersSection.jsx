import React from 'react';
import { Star, MapPin, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const PhotographersSection = () => {
  const { photographers, setSelectedPhotographerModal, setActiveBookingModal, navigateToTab } = useApp();
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#0b0e14] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 animate-slide-up">
          <div className="space-y-4 text-left max-w-2xl">
            <p className="section-label">
              {t('photographersSection.subtitle')}
            </p>
            <h2 className="section-heading font-serif">
              {t('photographersSection.title1')} <span className="text-gradient-amber italic">{t('photographersSection.title2')}</span>
            </h2>
            <p className="text-slate-400 text-base font-light">
              {t('photographersSection.desc')}
            </p>
          </div>

          <button
            onClick={() => navigateToTab('photographers')}
            className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 backdrop-blur-md transition hover:border-amber-500/50 self-start md:self-auto"
          >
            <span>{t('photographersSection.viewAll')}</span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Photographers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {photographers.slice(0, 3).map((p, index) => (
            <div
              key={p.photographer_id}
              className="glass-card overflow-hidden hover:-translate-y-2 hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-between group animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div>
                {/* Cover Image & Rating Badge */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={p.cover_image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-amber-400 text-sm font-bold shadow-xl">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{p.rating}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 text-left">
                  {/* Name & Rate */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors font-serif">
                          {p.name}
                        </h3>
                        {p.is_verified && (
                          <CheckCircle className="w-4 h-4 text-blue-400" title={t('photographersSection.verifiedPro')} />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2 font-light">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{p.location}</span>
                        <span className="mx-1 text-slate-600">•</span>
                        <span>{p.experience} {t('photographersSection.yrsExp')}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t('photographersSection.startsAt')}</p>
                      <p className="text-base font-extrabold text-amber-400 font-serif">₹{p.price_per_hour}<span className="text-xs text-slate-500 font-sans">{t('photographersSection.perHr')}</span></p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed font-light">
                    {p.bio}
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.specialties?.map((spec, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800/50 text-xs font-medium text-slate-300 border border-slate-700/50">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-2 grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedPhotographerModal(p)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
                >
                  {t('photographersSection.viewProfile')}
                </button>
                <button
                  onClick={() => setActiveBookingModal({ open: true, photographer_id: p.photographer_id, step: 1 })}
                  className="btn-amber py-3 px-4 text-sm hover-shine flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('photographersSection.bookNow')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
