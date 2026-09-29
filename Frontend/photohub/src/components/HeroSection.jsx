import React from 'react';
import { Camera, Calendar, Award, Star, ArrowRight, ShieldCheck, Sparkles, ChevronRight, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const HeroSection = () => {
  const { navigateToTab, setActiveBookingModal } = useApp();
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden bg-[#0b0e14] animate-fade-in">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-amber-700/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Hero Section Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-8 text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest shadow-inner glow-amber">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{t('landingHero.premium')}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] font-serif">
              {t('landingHero.capture')} <br />
              <span className="text-gradient-amber italic">
                {t('landingHero.moments')}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
              {t('landingHero.desc')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-4">
              <button
                onClick={() => navigateToTab('services')}
                className="btn-amber flex items-center gap-3 px-8 py-4 text-[15px] hover-shine"
              >
                <span className="font-bold tracking-wide">{t('landingHero.explore')}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveBookingModal({ open: true, step: 1 })}
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-[15px] border border-slate-700/80 backdrop-blur-md transition hover:border-amber-500/50"
              >
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>{t('landingHero.book')}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-amber-500" />
                <span className="font-medium">{t('landingHero.verified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="font-medium">{t('landingHero.rating')}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Frame */}
          <div className="lg:col-span-5 relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative mx-auto max-w-md lg:max-w-none animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 to-amber-700/10 rounded-[2rem] blur-2xl transform rotate-6 scale-105" />
              <div className="relative rounded-[2rem] border border-slate-700/60 bg-slate-900/90 p-3 shadow-2xl overflow-hidden group glass-card">
                <img
                  src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg"
                  alt={t('heroSection.premiumIndianWeddi')}
                  className="w-full h-[460px] object-cover rounded-2xl transition duration-700 group-hover:scale-105"
                />
                
                {/* Floating Rating Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-bold">4.9</span>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <p className="text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">{t('landingHero.featured')}</p>
                    <p className="text-white font-medium text-sm">{t('landingHero.featuredDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Statistics Counter Strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-[2rem] glass-card">
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-serif font-extrabold text-white">2,500+</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('heroSection.eventsCovered')}</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-serif font-extrabold text-amber-400">{t('heroSection.85K')}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('heroSection.premiumPackages')}</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-serif font-extrabold text-white">350+</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('heroSection.verifiedArtists')}</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-serif font-extrabold text-amber-400">100%</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('heroSection.secureBooking')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
