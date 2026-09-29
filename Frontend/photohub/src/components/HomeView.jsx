import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Calendar, DollarSign, Star, CheckCircle, Shield, Award, Users, ChevronRight, PlayCircle, Map, Target, Camera, Smartphone, Download, Heart, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// --- Hero Section ---
const HomeHero = () => {
  const { navigateToTab } = useApp();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[#080808]">
        <img 
          src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606978/photohub/images/studio-hero.jpg" 
          alt={t('homeView.premiumStudioPhoto')} 
          className="w-full h-full object-cover brightness-[0.6] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent"></div>
      </div>
      
      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-32 pb-20 flex-1 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl text-[#c89845] mb-2 font-serif italic" style={{ fontFamily: "'Dancing Script', 'Playfair Display', cursive, serif" }}>
            {t('homeHero.weCapture')}
          </h2>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-wide leading-tight uppercase">
            {t('homeHero.realMoments')}
          </h1>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#c89845] mb-6 tracking-wide leading-tight uppercase drop-shadow-lg">
            {t('homeHero.trueEmotions')}
          </h1>
          
          <div className="w-16 h-1 bg-transparent mb-6 rounded-full"></div>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 font-light leading-relaxed max-w-lg">
            {t('homeHero.desc')}
          </p>
          
          <button 
            onClick={() => navigateToTab('services')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-[#c89845] text-[#c89845] hover:bg-[#c89845] hover:text-white font-bold rounded shadow-xl transition-all uppercase tracking-wider text-sm"
          >
            {t('homeHero.explore')} <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Features Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-4 md:px-4">
              <Camera className="w-10 h-10 text-[#c89845] shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wide leading-snug">{t('homeHero.profPhotographers')}</h3>
                <p className="text-slate-400 text-xs mt-1">{t('homeHero.profDesc')}</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 md:px-4 pt-4 md:pt-0">
              <Clock className="w-10 h-10 text-[#c89845] shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wide leading-snug">{t('homeHero.onTime')}</h3>
                <p className="text-slate-400 text-xs mt-1">{t('homeHero.onTimeDesc')}</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 md:px-4 pt-4 md:pt-0">
              <Award className="w-10 h-10 text-[#c89845] shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wide leading-snug">{t('homeHero.premium')}</h3>
                <p className="text-slate-400 text-xs mt-1">{t('homeHero.premiumDesc')}</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-4 md:px-4 pt-4 md:pt-0">
              <Heart className="w-10 h-10 text-[#c89845] shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wide leading-snug">{t('homeHero.customer')}</h3>
                <p className="text-slate-400 text-xs mt-1">{t('homeHero.customerDesc')}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- Popular Categories ---
const PopularCategories = () => {
  const { navigateToTab } = useApp();
  const { t } = useTranslation();
  const categories = [
    { id: 'wedding-photography', nameKey: 'catNames.wedding', icon: '💍', img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607019/photohub/assets/categories/wedding.jpg' },
    { id: 'corporate-photography', nameKey: 'catNames.corporate', icon: '🏢', img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607001/photohub/assets/categories/corporate.jpg' },
    { id: 'product-photography', nameKey: 'catNames.product', icon: '🛍️', img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607014/photohub/assets/categories/product.jpg' },
    { id: 'fashion-photography', nameKey: 'catNames.fashion', icon: '👗', img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607009/photohub/assets/categories/fashion.jpg' },
    { id: 'food-photography', nameKey: 'catNames.food', icon: '🍔', img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607012/photohub/assets/categories/food.jpg' },
    { id: 'real-estate-photography', nameKey: 'catNames.realEstate', icon: '🏠', img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607016/photohub/assets/categories/real_estate.jpg' },
    { id: 'drone-photography', nameKey: 'catNames.drone', icon: '🚁', img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607003/photohub/assets/categories/drone.jpg' },
    { id: 'family-photography', nameKey: 'catNames.family', icon: '👨‍👩‍👧‍👦', img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607007/photohub/assets/categories/family.jpg' }
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('categories.title')}</h2>
          <p className="text-slate-400 max-w-2xl text-lg">{t('categories.subtitle')}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map(cat => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={cat.id}
            onClick={() => navigateToTab(cat.id)}
            className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer"
          >
            <img src={cat.img} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <span className="text-3xl mb-2">{cat.icon}</span>
              <h3 className="text-white font-bold text-lg">{t(cat.nameKey)}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Featured & Trending Photographers (Mock data combined) ---
const FeaturedPhotographers = ({ title, subtitle }) => {
  const { navigateToTab, photographers: allPhotographers, searchParams } = useApp();
  const { t } = useTranslation();
  
  const photographers = allPhotographers
    .filter(p => !searchParams?.city || searchParams.city === 'All' || p.location.toLowerCase().includes(searchParams.city.toLowerCase()))
    .slice(0, 3);

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400">{subtitle}</p>
        </div>
        <button onClick={() => navigateToTab('photographers')} className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
          {t('featured.viewAll')} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {photographers.map(p => (
          <div key={p.photographer_id} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 transition duration-300 group">
            <div className="h-48 relative overflow-hidden">
              <img src={p.cover_image || 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-white font-bold text-sm">{p.rating}</span>
              </div>
            </div>
            
            <div className="p-6 relative">
              <img src={p.logo_image || p.profile_picture || 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg'} className="w-16 h-16 rounded-full border-4 border-slate-800 absolute -top-8 left-6 object-cover" />
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {p.name}
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </h3>
                <p className="text-slate-400 text-sm mb-4">{p.specialties?.[0]}</p>
                
                <div className="flex justify-between items-center border-t border-slate-700/50 pt-4">
                  <div>
                    <p className="text-xs text-slate-500">{t('featured.startingAt')}</p>
                    <p className="text-xl font-bold text-white">₹{p.price_per_hour}/hr</p>
                  </div>
                  <button 
                    onClick={() => navigateToTab('profile', null, { id: p.photographer_id })} 
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition"
                  >
                    {t('featured.viewProfile')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Why Choose Us ---
const WhyChooseUs = () => {
  const { t } = useTranslation();
  const features = [
    { icon: <Shield className="w-8 h-8 text-emerald-400" />, title: t('whyChoose.verifiedPros'), desc: t('whyChoose.verifiedProsDesc') },
    { icon: <Award className="w-8 h-8 text-amber-400" />, title: t('whyChoose.premiumQuality'), desc: t('whyChoose.premiumQualityDesc') },
    { icon: <DollarSign className="w-8 h-8 text-blue-400" />, title: t('whyChoose.transparentPricing'), desc: t('whyChoose.transparentPricingDesc') },
    { icon: <CheckCircle className="w-8 h-8 text-purple-400" />, title: t('whyChoose.instantBooking'), desc: t('whyChoose.instantBookingDesc') }
  ];

  return (
    <div className="py-24 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">{t('whyChoose.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/80 transition">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6 shadow-inner">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Statistics ---
const Statistics = () => {
  const { t } = useTranslation();
  return (
    <div className="py-20 border-y border-slate-800 bg-black/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{t('homeView.15k')}</div>
            <div className="text-amber-500 font-medium tracking-wide uppercase text-sm">{t('stats.happyClients')}</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">1,200+</div>
            <div className="text-amber-500 font-medium tracking-wide uppercase text-sm">{t('stats.verifiedPros')}</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">45+</div>
            <div className="text-amber-500 font-medium tracking-wide uppercase text-sm">{t('stats.citiesCovered')}</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{t('homeView.30k')}</div>
            <div className="text-amber-500 font-medium tracking-wide uppercase text-sm">{t('stats.completedShoots')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Business Solutions CTA ---
const BusinessSolutionsCTA = () => {
  const { navigateToTab } = useApp();
  const { t } = useTranslation();
  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20 bg-[url('https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg')] bg-cover bg-center"></div>
        <div className="relative z-10 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl mb-8 md:mb-0">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 font-bold text-xs rounded-full uppercase tracking-wider mb-4 inline-block">{t('enterprise.badge')}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('enterprise.title')}</h2>
            <p className="text-blue-100 text-lg mb-8 opacity-90">
              {t('enterprise.desc')}
            </p>
            <button onClick={() => navigateToTab('corporate-photography')} className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-xl hover:scale-105 transition">
              {t('enterprise.btn')}
            </button>
          </div>
          <div className="w-full md:w-auto">
            <Target className="w-48 h-48 text-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- How It Works ---
const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto border-t border-slate-800/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('homeView.howItWorks')}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">{t('homeView.yourJourneyToPerf')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative mt-8">
        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent -translate-y-1/2 z-0"></div>
        {[
          { icon: <Search className="w-8 h-8 text-amber-500" />, title: "Discover Pros", desc: "Browse verified portfolios and find the perfect match for your style." },
          { icon: <Calendar className="w-8 h-8 text-amber-500" />, title: "Book & Pay", desc: "Check real-time availability and secure your date with safe payments." },
          { icon: <Camera className="w-8 h-8 text-amber-500" />, title: "Get Stunning Photos", desc: "Enjoy your shoot and receive high-quality edited photos on time." }
        ].map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-700 group-hover:border-amber-500/50 flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/5 transition-all duration-300 group-hover:-translate-y-2">
              {step.icon}
            </div>
            <div className="bg-amber-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm absolute top-20 right-[calc(50%-48px)] border-4 border-[#0b0e14]">
              {idx + 1}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-slate-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Testimonials ---
const ClientTestimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    { name: "Sarah Jenkins", role: "Bride", content: "Finding a wedding photographer was stressful until we found PhotoHub. The booking process was seamless, and our photos are breathtaking!", rating: 5, image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606957/photohub/images/event/event-1.jpg" },
    { name: "Michael Chen", role: "Corporate Event Manager", content: "We needed headshots and event coverage at the last minute. The photographer was professional, punctual, and delivered amazing results.", rating: 5, image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606969/photohub/images/food/food-1.jpg" },
    { name: "Emma Thompson", role: "Restaurant Owner", content: "The food photography blew me away. Our new menu looks incredible, and we've seen a noticeable increase in orders since updating the images.", rating: 5, image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg" }
  ];

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto border-t border-slate-800/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('homeView.lovedByClients')}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">{t('homeView.donTJustTakeOur')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((test, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 rounded-3xl hover:bg-slate-800/60 transition-colors duration-300"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(test.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <p className="text-slate-300 italic mb-8 leading-relaxed">"{test.content}"</p>
            <div className="flex items-center gap-4">
              <img src={test.image} alt={test.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
              <div>
                <h4 className="text-white font-bold">{test.name}</h4>
                <p className="text-slate-500 text-sm">{test.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Premium Portfolio Gallery ---
const PremiumPortfolioGallery = () => {
  const { t } = useTranslation();

  const portfolio = [
    { title: "Royal Indian Wedding", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606993/photohub/images/wedding/indian-wedding-hero.jpg" },
    { title: "Pre-Wedding at Udaipur Palace", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606974/photohub/images/locations/locations-1.jpg" },
    { title: "Haldi Ceremony", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg" },
    { title: "Mehendi Ceremony", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg" },
    { title: "Sangeet Night", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606957/photohub/images/event/event-1.jpg" },
    { title: "Engagement Ceremony", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg" },
    { title: "Destination Wedding in Goa", img: "/images/locations/locations-2.webp" },
    { title: "South Indian Temple Wedding", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606976/photohub/images/locations/locations-3.jpg" },
    { title: "Baby Photoshoot", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606962/photohub/images/family/family-1.jpg" },
    { title: "Maternity Shoot", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606963/photohub/images/family/family-2.jpg" },
    { title: "Birthday Celebration", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606958/photohub/images/event/event-2.jpg" },
    { title: "Fashion & Model Portfolio", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785607009/photohub/assets/categories/fashion.jpg" },
    { title: "Corporate Event Photography", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606950/photohub/images/corporate/corporate-1.jpg" },
    { title: "Product Photography", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785607014/photohub/assets/categories/product.jpg" },
    { title: "Food Photography", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606969/photohub/images/food/food-1.jpg" },
    { title: "Drone Wedding Photography", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606954/photohub/images/drone/drone-1.jpg" },
    { title: "Candid Couple Portraits", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg" },
    { title: "Bridal Close-up Makeup", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg" },
    { title: "Behind the Scenes Team", img: "/images/corporate/corporate-3.webp" },
    { title: "Luxury Studio Photoshoot", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606978/photohub/images/studio-hero.jpg" }
  ];

  return (
    <div className="py-24 px-4 w-full bg-[#0B0F19] border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('homeView.premiumPortfolio')}</h2>
          <p className="text-[#F4C542] max-w-2xl mx-auto text-lg font-medium tracking-wide">{t('homeView.showcasingDiverseP')}</p>
        </div>
        
        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {portfolio.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
              className="rounded-[24px] overflow-hidden relative group cursor-pointer shadow-lg shadow-black/40 break-inside-avoid"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.05]" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <Camera className="w-6 h-6 text-[#F4C542] mb-2" />
                <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- FAQ Section ---
const FAQSection = () => {
  const { t } = useTranslation();

  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    { q: "How do I book a photographer?", a: "Simply browse our categories or search by location, find a photographer whose style you love, and select 'Book Now' to view their availability and packages." },
    { q: "Is my payment secure?", a: "Yes. All payments are held securely in escrow until your photos are delivered and approved, guaranteeing peace of mind." },
    { q: "What happens if a photographer cancels?", a: "In the rare event of a cancellation, our support team will help you find a replacement photographer of equal or higher caliber immediately, or provide a full refund." },
    { q: "How and when will I receive my photos?", a: "Photos are typically delivered digitally via our secure Client Delivery Portal within 1-2 weeks of your shoot, depending on your photographer's stated turnaround time." }
  ];

  return (
    <div className="py-24 px-4 max-w-3xl mx-auto border-t border-slate-800/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('homeView.frequentlyAskedQue')}</h2>
        <p className="text-slate-400 text-lg">{t('homeView.everythingYouNeed')}</p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-lg font-bold text-white">{faq.q}</span>
              <ChevronRight className={`w-5 h-5 text-amber-500 transition-transform duration-300 ${openIndex === idx ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-5 text-slate-400"
                >
                  <p className="pt-2 border-t border-slate-800/50">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Join As Photographer ---
const JoinAsPhotographer = () => {
  const { t } = useTranslation();

  const { navigateToTab, isAuthenticated, logoutUser } = useApp();
  return (
    <div className="relative py-24 overflow-hidden border-t border-slate-800">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg" 
          alt={t('homeView.photographer')} 
          className="w-full h-full object-cover opacity-20 brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14] via-[#0b0e14]/90 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="max-w-2xl mb-10 md:mb-0">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('homeView.areYouATalentedP')}</h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">{t('homeView.joinThousandsOfPr')}</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-amber-500" /> <span className="text-white font-medium">{t('homeView.CommissionOnFir')}</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-amber-500" /> <span className="text-white font-medium">{t('homeView.globalExposure')}</span></div>
          </div>
          <button onClick={() => {
            if (isAuthenticated) logoutUser();
            navigateToTab('login', null, { mode: 'register', role: 'photographer' });
          }} className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
{t('homeView.applyAsAProfessio')}
</button>
        </div>
      </div>
    </div>
  );
};

// --- PhotoHub Guarantee ---
const PhotoHubGuarantee = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-slate-900 to-[#0b0e14] py-16 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-6 border border-amber-500/30">
          <Shield className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{t('homeView.thePhotoHubGuarant')}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-10">{t('homeView.wePrioritizeYourP')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">{t('homeView.secureEscrow')}</h3>
            <p className="text-slate-400 text-sm">{t('homeView.yourPaymentIsHeld')}</p>
          </div>
          <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
            <Award className="w-8 h-8 text-amber-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">{t('homeView.100Satisfaction')}</h3>
            <p className="text-slate-400 text-sm">{t('homeView.ifThePhotosDonT')}</p>
          </div>
          <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">{t('homeView.vettedProfessionals')}</h3>
            <p className="text-slate-400 text-sm">{t('homeView.everyPhotographerG')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Style Explorer ---
const StyleExplorer = () => {
  const { t } = useTranslation();

  const styles = [
    { name: "Cinematic", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg" },
    { name: "Light & Airy", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606960/photohub/images/faces/faces-2.jpg" },
    { name: "Dark & Moody", img: "/images/faces/faces-3.webp" },
    { name: "Vintage Film", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg" },
    { name: "Editorial", img: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606960/photohub/images/faces/faces-2.jpg" }
  ];

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto border-t border-slate-800/50 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/3">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('homeView.discoverYourAesthe')}</h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">{t('homeView.notSureWhatYouRe')}</p>
          <button className="px-8 py-4 bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold rounded-xl transition-all">
{t('homeView.exploreAllStyles')}
</button>
        </div>
        <div className="w-full md:w-2/3 flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {styles.map((style, idx) => (
            <div key={idx} className="min-w-[250px] h-[350px] relative rounded-3xl overflow-hidden snap-center group cursor-pointer shadow-2xl">
              <img src={style.img} alt={style.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                <h3 className="text-xl font-bold text-white mb-2">{style.name}</h3>
                <p className="text-sm text-amber-500 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 flex items-center gap-1">Browse Photographers <ChevronRight className="w-4 h-4" /></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HomeView = () => {
  const { searchParams } = useApp();
  const { t } = useTranslation();

  return (
    <div className="bg-[#0b0e14] min-h-screen">
      <HomeHero />
      <HowItWorks />
      <PopularCategories />
      <FeaturedPhotographers title={t('featured.title')} subtitle={t('featured.subtitle')} />
      <PhotoHubGuarantee />
      <WhyChooseUs />
      <PremiumPortfolioGallery />
      <FeaturedPhotographers title={t('trending.title')} subtitle={t('trending.subtitle')} />
      <ClientTestimonials />
      <JoinAsPhotographer />
      <Statistics />
      <FAQSection />
      <StyleExplorer />
      <BusinessSolutionsCTA />
    </div>
  );
};
