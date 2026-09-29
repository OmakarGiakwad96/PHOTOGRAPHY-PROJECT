import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Camera, Users, CheckCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const citiesData = [
  { 
    id: "Pune", name: "Pune", state: "Maharashtra", 
    desc: "Professional photography services across Pune.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg",
    photographers: 185, categories: 28, bookings: 4850, rating: 4.9 
  },
  { 
    id: "Mumbai", name: "Mumbai", state: "Maharashtra", 
    desc: "Trusted photographers for every occasion.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg",
    photographers: 420, categories: 35, bookings: 12450, rating: 4.9 
  },
  { 
    id: "Bangalore", name: "Bangalore", state: "Karnataka", 
    desc: "Book verified photographers near you.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg",
    photographers: 310, categories: 30, bookings: 8900, rating: 4.8 
  },
  { 
    id: "Hyderabad", name: "Hyderabad", state: "Telangana", 
    desc: "Capture your best moments in Hyderabad.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg",
    photographers: 270, categories: 25, bookings: 6500, rating: 4.8 
  },
  { 
    id: "Delhi", name: "Delhi", state: "NCR", 
    desc: "Top-rated professionals for your special events.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606957/photohub/images/event/event-1.jpg",
    photographers: 380, categories: 32, bookings: 11200, rating: 4.7 
  },
  { 
    id: "Chennai", name: "Chennai", state: "Tamil Nadu", 
    desc: "Creative photography services in Chennai.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg",
    photographers: 210, categories: 22, bookings: 5400, rating: 4.7 
  },
  { 
    id: "Ahmedabad", name: "Ahmedabad", state: "Gujarat", 
    desc: "Verified pros for weddings and corporate events.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606958/photohub/images/event/event-2.jpg",
    photographers: 150, categories: 20, bookings: 3200, rating: 4.8 
  },
  { 
    id: "Jaipur", name: "Jaipur", state: "Rajasthan", 
    desc: "Stunning photography for the Pink City.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg",
    photographers: 190, categories: 24, bookings: 4100, rating: 4.9 
  },
  { 
    id: "Kolkata", name: "Kolkata", state: "West Bengal", 
    desc: "Professional shoots across the City of Joy.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg",
    photographers: 230, categories: 26, bookings: 6100, rating: 4.7 
  },
  { 
    id: "Goa", name: "Goa", state: "Goa", 
    desc: "Capture your destination weddings and beach shoots.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg",
    photographers: 140, categories: 18, bookings: 5500, rating: 4.9 
  },
  { 
    id: "Surat", name: "Surat", state: "Gujarat", 
    desc: "Verified pros for fashion and commercial shoots.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606965/photohub/images/fashion/fashion-1.jpg",
    photographers: 120, categories: 16, bookings: 2400, rating: 4.7 
  },
  { 
    id: "Nagpur", name: "Nagpur", state: "Maharashtra", 
    desc: "Trusted photographers for your special day.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg",
    photographers: 95, categories: 12, bookings: 1500, rating: 4.7 
  },
  { 
    id: "Nashik", name: "Nashik", state: "Maharashtra", 
    desc: "Capture your memories in Nashik.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg",
    photographers: 85, categories: 12, bookings: 1200, rating: 4.8 
  },
  { 
    id: "Indore", name: "Indore", state: "Madhya Pradesh", 
    desc: "Professional photography across Indore.",
    image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg",
    photographers: 105, categories: 14, bookings: 1800, rating: 4.8 
  }
];

export const CitiesWeServe = () => {
  const { navigateToTab, searchParams, setSearchParams } = useApp();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExplore = (cityName) => {

    setSearchParams({
      ...searchParams,
      city: cityName
    });
    navigateToTab('photographers');
  };

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6"
      >
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              {t('cities.title')}
            </h2>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed">
            {t('cities.subtitle')}
          </p>
        </div>
      </motion.div>

      <div className="flex justify-center mt-8">
        <div className="relative w-full max-w-sm" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 border-2 border-slate-700 hover:border-amber-500 rounded-2xl text-white font-bold text-lg shadow-xl transition-all group"
          >
            <span className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-amber-500" />
              {searchParams?.city ? (t(`citiesData.${searchParams.city}.name`) || searchParams.city) : (t('cities.selectCity') || 'Select a City...')}
            </span>
            <ChevronDown className={`w-5 h-5 text-slate-400 group-hover:text-white transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-3 bg-slate-900/95 backdrop-blur-2xl border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/50 scrollbar-track-transparent"
              >
                {citiesData.map((city) => {
                  const isSelected = searchParams?.city === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => {
                        handleExplore(city.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-6 py-4 transition-colors border-b border-slate-800 last:border-0 ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                      <MapPin className={`w-5 h-5 ${isSelected ? 'text-amber-500' : 'text-slate-500'}`} />
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-base">{t(`citiesData.${city.id}.name`) || city.name}</span>
                        <span className="text-[10px] tracking-widest uppercase opacity-70 font-semibold">{t(`citiesData.${city.id}.state`) || city.state}</span>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 ml-auto text-amber-500" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
    </section>
  );
};
