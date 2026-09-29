import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, Camera, Calendar as CalendarIcon, Edit3, Star, 
  ChevronRight, Compass, Shield, Clock, Heart, ArrowRight,
  Gift, Percent, PlayCircle, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const ClientHome = () => {
  const { currentUser, searchParams, setSearchParams, navigateToTab, photographers, bookings } = useApp();
  const { t } = useTranslation();

  const activeBooking = bookings.find(b => b.user_id === currentUser.user_id && b.status === 'confirmed');

  const greeting = new Date().getHours() < 12 ? t('clientHome.goodMorning') 
                 : new Date().getHours() < 18 ? t('clientHome.goodAfternoon') 
                 : t('clientHome.goodEvening');

  // Filter recommendations based on search
  const recommendedPhotographers = photographers.filter(p => 
    (!searchParams.city || p.location.includes(searchParams.city)) &&
    (!searchParams.category || p.specialties.includes(searchParams.category))
  ).slice(0, 5);

  const fallbackPhotographers = photographers.slice(0, 5);
  const displayPhotographers = recommendedPhotographers.length > 0 ? recommendedPhotographers : fallbackPhotographers;

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      
      {/* SECTION 1: HERO */}
      <section className="relative rounded-[2rem] overflow-hidden min-h-[400px] flex flex-col justify-end p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg" 
            alt={t('clientHome.welcomeBackground')} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div>
            <p className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-2">{greeting}</p>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              {t('clientHome.welcomeBack', { name: currentUser.name.split(' ')[0] })}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold">
              <MapPin className="w-4 h-4 text-amber-400" />
              {searchParams.city || t('clientHome.anyCity')}
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold">
              <Camera className="w-4 h-4 text-emerald-400" />
              {searchParams.category || t('clientHome.anyCategory')}
            </div>
            {searchParams.date && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold">
                <CalendarIcon className="w-4 h-4 text-blue-400" />
                {searchParams.date}
              </div>
            )}
            <button 
              onClick={() => navigateToTab('home')}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-full text-sm font-bold transition shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              <Edit3 className="w-4 h-4" /> {t('clientHome.changeSearch')}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: UPCOMING BOOKING (Prioritized if exists) */}
      {activeBooking && (
        <section className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs mb-2">
              <Clock className="w-4 h-4" /> {t('clientHome.upcomingShoot')}
            </div>
            <h2 className="text-2xl font-bold text-white">{t('clientHome.preWeddingShootWi')}</h2>
            <p className="text-slate-400">{t('clientHome.in3DaysGoaBeac')}</p>
          </div>
          <button 
            onClick={() => navigateToTab('client/bookings')}
            className="relative z-10 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition whitespace-nowrap"
          >
            {t('clientHome.viewDetails')}
          </button>
        </section>
      )}

      {/* SECTION 2: RECOMMENDED PHOTOGRAPHERS */}
      <section id="recommended-photographers">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{t('clientHome.recommendedTitle')}</h2>
            <p className="text-slate-400 text-sm">{t('clientHome.recommendedSub')}</p>
          </div>
          <button 
            onClick={() => navigateToTab('photographers')}
            className="text-amber-400 text-sm font-bold flex items-center gap-1 hover:text-amber-300"
          >
            {t('clientHome.seeAll')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x">
          {displayPhotographers.map(p => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={p.photographer_id} 
              onClick={() => navigateToTab('profile', null, { photographerId: p.photographer_id })}
              className="min-w-[280px] sm:min-w-[320px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 snap-start group cursor-pointer"
            >
              <div className="h-48 relative">
                <img src={p.portfolio_images?.[0] || 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg'} alt={p.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-bold">{p.rating}</span>
                </div>
                <button className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-amber-500 hover:text-black transition">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {p.name} <Shield className="w-4 h-4 text-blue-400" />
                  </h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">{p.specialties.join(' • ')}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{t('clientHome.startsFrom')}</p>
                    <p className="text-white font-bold">₹{p.price_per_day}{t('clientHome.perDay')}</p>
                  </div>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition">
                    {t('clientHome.viewProfile')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: EXCLUSIVE OFFERS */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">{t('clientHome.exclusiveOffers')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-900 rounded-3xl p-8 relative overflow-hidden flex items-center justify-between group cursor-pointer">
            <div className="relative z-10 max-w-[200px]">
              <div className="flex items-center gap-2 text-purple-200 font-bold text-xs uppercase mb-2">
                <Gift className="w-4 h-4" /> Festive Special
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('clientHome.offer1Title')}</h3>
              <p className="text-purple-200 text-sm mb-4">{t('clientHome.offer1Desc')}</p>
              <button className="px-4 py-2 bg-white text-purple-900 text-xs font-bold rounded-lg shadow-xl">{t('clientHome.claimNow')}</button>
            </div>
            <Percent className="w-32 h-32 text-white/10 absolute right-4 -bottom-4 transform group-hover:scale-110 transition duration-500" />
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-900 rounded-3xl p-8 relative overflow-hidden flex items-center justify-between group cursor-pointer">
            <div className="relative z-10 max-w-[200px]">
              <div className="flex items-center gap-2 text-emerald-200 font-bold text-xs uppercase mb-2">
                <Shield className="w-4 h-4" /> First Booking
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('clientHome.offer2Title')}</h3>
              <p className="text-emerald-200 text-sm mb-4">{t('clientHome.offer2Desc')}</p>
              <button className="px-4 py-2 bg-white text-emerald-900 text-xs font-bold rounded-lg shadow-xl">{t('clientHome.explore')}</button>
            </div>
            <Gift className="w-32 h-32 text-white/10 absolute right-4 -bottom-4 transform group-hover:scale-110 transition duration-500" />
          </div>
        </div>
      </section>

      {/* SECTION 7: INSPIRATION */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{t('clientHome.photographyInspirat')}</h2>
            <p className="text-slate-400 text-sm">{t('clientHome.discoverBeautifulM')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
            <img src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden relative group h-40">
            <img src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          </div>
          <div className="rounded-2xl overflow-hidden relative group h-40">
            <img src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          </div>
          <div className="rounded-2xl overflow-hidden relative group h-40">
            <img src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          </div>
          <div className="rounded-2xl overflow-hidden relative group h-40">
            <img src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          </div>
        </div>
      </section>

      {/* SECTION 8: RECOMMENDED CATEGORIES */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">{t('clientHome.youMayAlsoLike')}</h2>
        <div className="flex flex-wrap gap-4">
          {['Birthday', 'Corporate', 'Food', 'Product', 'Fashion', 'Drone', 'Baby Shoot'].map(cat => (
            <button 
              key={cat} 
              onClick={() => {
                setSearchParams(prev => ({ ...prev, category: cat }));
                navigateToTab('client/find-photographer');
              }}
              className="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-white rounded-full text-sm font-semibold transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
