import React from 'react';
import { useApp } from '../context/AppContext';
import { landingPagesConfig } from '../data/landingPagesConfig';
import { Star, MapPin, IndianRupee, CheckCircle, ChevronRight, MessageCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const ServiceLandingPage = ({ serviceId }) => {
  const { navigateToTab, photographers: allPhotographers } = useApp();
  const { t } = useTranslation();
  const config = landingPagesConfig[serviceId];

  if (!config) {
    return <div className="p-20 text-center text-white">{t('servicePage.notFound')}</div>;
  }

  // Real photographers
  const photographers = allPhotographers.slice(0, 3);

  return (
    <div className="bg-[#0b0e14] min-h-screen pb-20">
      
      {/* 1. Premium Hero Banner */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={config.heroImage} alt={config.title} className="w-full h-full object-cover brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            {config.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 mb-8"
          >
            {config.description}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center gap-4">
            <button onClick={() => navigateToTab('photographers')} className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-xl transition">
              {t('servicePage.findPhotographers')}
            </button>
            <button className="px-8 py-4 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 font-bold transition flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> {t('servicePage.whatsappUs')}
            </button>
          </motion.div>
        </div>
      </div>

      {/* 2. Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {config.benefits.map((b, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-2xl">
              <CheckCircle className="w-10 h-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{b.title}</h3>
              <p className="text-slate-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Pricing Packages */}
      <div className="bg-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">{t('servicePage.pricingTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-2">{t('servicePage.standardTitle')}</h3>
              <p className="text-slate-400 mb-6">{t('servicePage.standardDesc')}</p>
              <div className="text-4xl font-extrabold text-amber-500 mb-8 flex items-end gap-1">
                <IndianRupee className="w-6 h-6 mb-1"/>{config.pricing.base}
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex text-slate-300 gap-3"><CheckCircle className="w-5 h-5 text-amber-500"/> {t('servicePage.hoursCoverage4')}</li>
                <li className="flex text-slate-300 gap-3"><CheckCircle className="w-5 h-5 text-amber-500"/> {t('servicePage.editedPhotos')}</li>
              </ul>
              <button onClick={() => navigateToTab('photographers')} className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition">{t('servicePage.bookStandard')}</button>
            </div>
            
            {/* Premium */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-3xl p-8 border border-amber-400 shadow-2xl shadow-amber-500/20 transform md:-translate-y-4 relative">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-black text-amber-400 px-4 py-1 rounded-full text-sm font-bold tracking-wider">{t('servicePage.popular')}</div>
              <h3 className="text-2xl font-bold text-black mb-2">{t('servicePage.premiumTitle')}</h3>
              <p className="text-black/80 mb-6">{t('servicePage.premiumDesc')}</p>
              <div className="text-4xl font-extrabold text-black mb-8 flex items-end gap-1">
                <IndianRupee className="w-6 h-6 mb-1"/>{config.pricing.premium}
              </div>
              <ul className="space-y-4 mb-8 text-black/90 font-medium">
                <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-black"/> {t('servicePage.fullDay')}</li>
                <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-black"/> {t('servicePage.cinematicVideo')}</li>
                <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-black"/> {t('servicePage.printedAlbum')}</li>
              </ul>
              <button onClick={() => navigateToTab('photographers')} className="w-full py-3 rounded-xl bg-black hover:bg-gray-900 text-amber-400 font-bold transition">{t('servicePage.bookPremium')}</button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Top Photographers (Filtered) */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white mb-10">{t('servicePage.topRated')}{config.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {photographers.map(p => (
            <div key={p.photographer_id} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 transition">
              <div className="h-48 relative overflow-hidden">
                <img src={p.cover_image || 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg'} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 relative">
                <img src={p.logo_image || p.profile_picture || 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg'} className="w-16 h-16 rounded-full border-4 border-slate-800 absolute -top-8 left-6 object-cover" />
                <h3 className="text-xl font-bold text-white mt-8">{p.name}</h3>
                <p className="text-amber-400 text-sm mb-4">★ {p.rating}</p>
                <button 
                  onClick={() => navigateToTab('profile', null, { id: p.photographer_id })} 
                  className="w-full py-2 bg-slate-700 hover:bg-amber-500 hover:text-black text-white rounded-lg font-semibold transition text-sm"
                >
                  {t('servicePage.viewProfile')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
