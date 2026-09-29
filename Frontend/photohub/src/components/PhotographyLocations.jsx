import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Camera, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const locationData = {
  Pune: [
    { name: "Shaniwar Wada", image: "/images/locations/locations-2.webp", desc: "Historic fortification with majestic architecture.", bestFor: "Pre-Wedding", distance: "2 km", shoots: 1240, rating: 4.8 },
    { name: "Aga Khan Palace", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606976/photohub/images/locations/locations-3.jpg", desc: "Beautiful palace with Italian arches and spacious lawns.", bestFor: "Fashion", distance: "5 km", shoots: 850, rating: 4.9 },
    { name: "Sinhagad Fort", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606974/photohub/images/locations/locations-1.jpg", desc: "Scenic hill fort surrounded by lush green valleys.", bestFor: "Pre-Wedding", distance: "30 km", shoots: 1520, rating: 4.7 },
    { name: "Khadakwasla Dam", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg", desc: "Picturesque dam offering serene water backdrops.", bestFor: "Family", distance: "20 km", shoots: 930, rating: 4.6 },
    { name: "Saras Baug", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg", desc: "Lush green garden with a beautiful lake and temple.", bestFor: "Baby Shoot", distance: "3 km", shoots: 710, rating: 4.5 },
    { name: "FC Road", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg", desc: "Vibrant street perfect for urban and candid photography.", bestFor: "Fashion", distance: "1 km", shoots: 1100, rating: 4.8 },
    { name: "Mulshi Dam", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg", desc: "Breathtaking views of the Sahyadri mountains.", bestFor: "Pre-Wedding", distance: "45 km", shoots: 640, rating: 4.9 },
    { name: "Lavasa", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg", desc: "Italian-styled planned city by the lake.", bestFor: "Wedding", distance: "60 km", shoots: 2100, rating: 4.9 },
  ],
  Mumbai: [
    { name: "Gateway of India", image: "/images/locations/locations-2.webp", desc: "Iconic monument overlooking the Arabian Sea.", bestFor: "Wedding", distance: "0 km", shoots: 5400, rating: 4.9 },
    { name: "Marine Drive", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg", desc: "The Queen's Necklace, perfect for sunset silhouettes.", bestFor: "Pre-Wedding", distance: "2 km", shoots: 4200, rating: 4.8 },
    { name: "Juhu Beach", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606960/photohub/images/faces/faces-2.jpg", desc: "Bustling beach ideal for golden hour portraits.", bestFor: "Family", distance: "20 km", shoots: 3100, rating: 4.6 },
    { name: "Bandra Fort", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606976/photohub/images/locations/locations-3.jpg", desc: "Historic ruins with the Sea Link in the background.", bestFor: "Pre-Wedding", distance: "18 km", shoots: 2800, rating: 4.8 },
    { name: "Bandra Bandstand", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg", desc: "Rocky promenade popular for romantic shoots.", bestFor: "Fashion", distance: "18 km", shoots: 2500, rating: 4.7 },
    { name: "Worli Sea Link", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg", desc: "Modern architectural marvel for urban backdrops.", bestFor: "Commercial", distance: "15 km", shoots: 1900, rating: 4.8 },
    { name: "Elephanta Caves", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg", desc: "Ancient rock-cut temples on an island.", bestFor: "Pre-Wedding", distance: "11 km", shoots: 800, rating: 4.7 },
    { name: "Sanjay Gandhi National Park", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg", desc: "Lush forest offering natural and wild aesthetics.", bestFor: "Pre-Wedding", distance: "30 km", shoots: 1200, rating: 4.8 },
  ],
  Delhi: [
    { name: "India Gate", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg", desc: "Grand war memorial surrounded by lush lawns.", bestFor: "Pre-Wedding", distance: "0 km", shoots: 3400, rating: 4.8 },
    { name: "Lodhi Garden", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg", desc: "Historical tombs nestled in a beautiful city park.", bestFor: "Fashion", distance: "4 km", shoots: 4100, rating: 4.9 },
    { name: "Humayun's Tomb", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606974/photohub/images/locations/locations-1.jpg", desc: "Mughal architecture with stunning geometric gardens.", bestFor: "Wedding", distance: "6 km", shoots: 5200, rating: 4.9 },
    { name: "Qutub Minar", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg", desc: "Tallest brick minaret surrounded by ancient ruins.", bestFor: "Pre-Wedding", distance: "15 km", shoots: 2900, rating: 4.8 },
    { name: "Lotus Temple", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg", desc: "Flower-like architectural masterpiece.", bestFor: "Commercial", distance: "12 km", shoots: 1500, rating: 4.7 },
    { name: "Hauz Khas", image: "/images/locations/locations-2.webp", desc: "Blend of historic fort ruins and a serene lake.", bestFor: "Fashion", distance: "11 km", shoots: 3800, rating: 4.8 },
    { name: "Red Fort", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606976/photohub/images/locations/locations-3.jpg", desc: "Massive sandstone fort from the Mughal era.", bestFor: "Pre-Wedding", distance: "5 km", shoots: 2100, rating: 4.7 },
    { name: "Connaught Place", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg", desc: "Colonial-style circular market with white pillars.", bestFor: "Fashion", distance: "1 km", shoots: 1900, rating: 4.6 },
  ],
  Bangalore: [
    { name: "Cubbon Park", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg", desc: "Extensive greenery right in the heart of the city.", bestFor: "Pre-Wedding", distance: "1 km", shoots: 4500, rating: 4.8 },
    { name: "Lalbagh Botanical Garden", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg", desc: "Famous for the Glass House and exotic flora.", bestFor: "Family", distance: "4 km", shoots: 3800, rating: 4.7 },
    { name: "Bangalore Palace", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606974/photohub/images/locations/locations-1.jpg", desc: "Tudor-style royal palace with sprawling grounds.", bestFor: "Wedding", distance: "3 km", shoots: 2100, rating: 4.9 },
    { name: "Nandi Hills", image: "/images/locations/locations-2.webp", desc: "Hill fortress known for spectacular sunrise views.", bestFor: "Pre-Wedding", distance: "60 km", shoots: 3200, rating: 4.8 },
    { name: "MG Road", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg", desc: "Bustling boulevard perfect for urban street style.", bestFor: "Fashion", distance: "0 km", shoots: 1500, rating: 4.6 },
    { name: "Ulsoor Lake", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg", desc: "Vast lake offering peaceful and scenic backdrops.", bestFor: "Pre-Wedding", distance: "3 km", shoots: 1200, rating: 4.7 },
    { name: "Church Street", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg", desc: "Cobblestone street with cafes and vibrant art.", bestFor: "Fashion", distance: "1 km", shoots: 1800, rating: 4.8 },
    { name: "Vidhana Soudha", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg", desc: "Imposing state legislature building.", bestFor: "Commercial", distance: "1 km", shoots: 900, rating: 4.7 },
  ],
  Hyderabad: [
    { name: "Charminar", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606976/photohub/images/locations/locations-3.jpg", desc: "Iconic monument amidst a bustling historic market.", bestFor: "Wedding", distance: "0 km", shoots: 3500, rating: 4.8 },
    { name: "Golconda Fort", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606974/photohub/images/locations/locations-1.jpg", desc: "Majestic citadel offering incredible panoramic views.", bestFor: "Pre-Wedding", distance: "11 km", shoots: 4200, rating: 4.9 },
    { name: "Hussain Sagar", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg", desc: "Heart-shaped lake featuring a giant Buddha statue.", bestFor: "Pre-Wedding", distance: "5 km", shoots: 2100, rating: 4.7 },
    { name: "Ramoji Film City", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg", desc: "Massive film studio complex with diverse sets.", bestFor: "Wedding", distance: "30 km", shoots: 5500, rating: 4.9 },
    { name: "Necklace Road", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg", desc: "Scenic boulevard along the Hussain Sagar lake.", bestFor: "Family", distance: "6 km", shoots: 1800, rating: 4.6 },
    { name: "Chowmahalla Palace", image: "/images/locations/locations-2.webp", desc: "Opulent palace of the Nizams with grand halls.", bestFor: "Wedding", distance: "2 km", shoots: 3100, rating: 4.9 },
    { name: "Durgam Cheruvu", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg", desc: "Secret lake surrounded by modern cityscapes.", bestFor: "Fashion", distance: "15 km", shoots: 2400, rating: 4.8 },
    { name: "Shilparamam", image: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg", desc: "Arts and crafts village showcasing rural charm.", bestFor: "Pre-Wedding", distance: "14 km", shoots: 1600, rating: 4.7 },
  ]
};

export const PhotographyLocations = ({ city }) => {
  const { navigateToTab, searchParams, setSearchParams } = useApp();
  const { t } = useTranslation();

  // Handle case where city might not perfectly match our mock data keys
  const locations = locationData[city] || [];

  if (locations.length === 0) return null;

  const handleViewPhotographers = (locationName, category) => {

    // Update global search params and navigate
    setSearchParams({
      ...searchParams,
      city: city,
      category: category,
      location: locationName
    });
    navigateToTab('photographers');
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-amber-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {t('locations.title')}{t(`citiesData.${city}.name`) || city}
          </h2>
        </div>
        <p className="text-slate-400 max-w-2xl text-lg">
          {t('locations.subtitle')}
        </p>
      </motion.div>

      <div className="flex gap-6 overflow-x-auto pb-8 pt-4 custom-scrollbar snap-x">
        {locations.map((loc, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="min-w-[320px] md:min-w-[400px] bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden snap-start flex flex-col group relative"
          >
            {/* Image Container */}
            <div className="h-56 relative overflow-hidden">
              <img 
                src={loc.image} 
                alt={loc.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
              
              {/* Top badges */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white text-sm font-bold">{loc.rating}</span>
              </div>
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-white text-sm font-bold">{loc.distance}</span>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white drop-shadow-md">{loc.name}</h3>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <p className="text-slate-400 text-sm leading-relaxed">{loc.desc}</p>
              
              <div className="flex items-center justify-between border-y border-slate-800 py-3">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">{t('locations.bestFor')}</span>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                    <Camera className="w-4 h-4" /> {loc.bestFor}
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">{t('locations.completed')}</span>
                  <div className="flex items-center gap-1 text-blue-400 text-sm font-bold">
                    <Users className="w-4 h-4" /> {loc.shoots.toLocaleString()} {t('locations.shoots')}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleViewPhotographers(loc.name, loc.bestFor)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-amber-500 border border-white/10 hover:border-amber-400 text-white hover:text-black font-bold rounded-xl transition duration-300 group/btn"
              >
                {t('locations.viewPhotographers')}
                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
