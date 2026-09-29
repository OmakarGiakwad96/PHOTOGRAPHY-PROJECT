import React, { useState } from 'react';
import { Search, MapPin, Star, CheckCircle, Calendar, SlidersHorizontal, Scale, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import VendorComparator from './VendorComparator';
import { useTranslation } from 'react-i18next';

export const PhotographersDirectory = () => {
  const { photographers, studios, setSelectedPhotographerModal, setActiveBookingModal, navigateToTab, searchParams, setSearchParams } = useApp();
  const { t } = useTranslation();
  
  const [directoryType, setDirectoryType] = useState('individuals'); // 'individuals' or 'studios'
  const [searchTerm, setSearchTerm] = useState('');
  
  const locationFilter = searchParams?.city || 'All';
  const setLocationFilter = (city) => setSearchParams(prev => ({ ...prev, city }));
  
  const [minRatingFilter, setMinRatingFilter] = useState('All');
  
  const categoryFilter = searchParams?.category || 'All';
  const setCategoryFilter = (category) => setSearchParams(prev => ({ ...prev, category }));
  
  const [compareIds, setCompareIds] = useState([]);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);

  const filteredPhotographers = photographers?.filter((p) => {
  const { t } = useTranslation();

    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'All' || p.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesRating = minRatingFilter === 'All' || p.rating >= parseFloat(minRatingFilter);
    const matchesCategory = categoryFilter === 'All' || p.specialties?.some(s => s.toLowerCase() === categoryFilter.toLowerCase());
    return matchesSearch && matchesLocation && matchesRating && matchesCategory;
  }) || [];

  const filteredStudios = studios?.filter((s) => {
  const { t } = useTranslation();

    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'All' || s.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesRating = minRatingFilter === 'All' || s.rating >= parseFloat(minRatingFilter);
    const matchesCategory = categoryFilter === 'All' || s.specialties?.some(spec => spec.toLowerCase() === categoryFilter.toLowerCase());
    return matchesSearch && matchesLocation && matchesRating && matchesCategory;
  }) || [];

  const toggleCompare = (e, id) => {

    e.stopPropagation();
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) {
        alert(t('photographersDirectory.youCanOnlyCompare'));
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-screen">
      <VendorComparator isOpen={isComparatorOpen} onClose={() => setIsComparatorOpen(false)} selectedIds={compareIds} />

      {compareIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <button 
            onClick={() => setIsComparatorOpen(true)}
            className="btn-amber shadow-2xl flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold"
          >
            <Scale className="w-5 h-5" /> {t('directory.compareCount', { count: compareIds.length })}
          </button>
        </div>
      )}

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-left space-y-4 mb-12 animate-slide-up flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-serif">
            {t('directory.title1')} <span className="text-gradient-amber italic">{t('directory.title2')}</span>
          </h1>
          <p className="text-slate-400 text-base font-light max-w-2xl mt-4">
            {t('directory.subtitle')}
          </p>
        </div>
      </div>

      {/* Directory Type Toggle (Individual vs Studio) */}
      <div className="flex justify-center mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="inline-flex bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/60 shadow-xl">
          <button
            onClick={() => setDirectoryType('individuals')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              directoryType === 'individuals'
                ? 'bg-amber-500 text-black shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {t('directory.individuals')}
          </button>
          <button
            onClick={() => setDirectoryType('studios')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              directoryType === 'studios'
                ? 'bg-amber-500 text-black shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            {t('directory.studios')}
          </button>
        </div>
      </div>

      {/* Advanced Filter Controls Bar */}
      <div className="glass-card p-4 rounded-2xl mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Search */}
        <div className="relative group">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('directory.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/60 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:bg-slate-900 transition-colors"
          />
        </div>

        {/* Location Filter */}
        <div className="relative group">
          <MapPin className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-amber-500/60 focus:bg-slate-900 transition-colors appearance-none"
          >
            <option value="All">{t('directory.allLocations')}</option>
            <option value="Mumbai">{t('directory.locMumbai')}</option>
            <option value="Delhi">{t('directory.locDelhi')}</option>
            <option value="Bangalore">{t('directory.locBangalore')}</option>
            <option value="Hyderabad">{t('directory.locHyderabad')}</option>
            <option value="Chennai">{t('directory.locChennai')}</option>
            <option value="Kolkata">{t('directory.locKolkata')}</option>
            <option value="Pune">{t('directory.locPune')}</option>
            <option value="Ahmedabad">{t('directory.locAhmedabad')}</option>
            <option value="Jaipur">{t('directory.locJaipur')}</option>
            <option value="Chandigarh">{t('directory.locChandigarh')}</option>
            <option value="Lucknow">{t('directory.locLucknow')}</option>
            <option value="Goa">{t('directory.locGoa')}</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative group">
          <SlidersHorizontal className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-amber-500/60 focus:bg-slate-900 transition-colors appearance-none"
          >
            <option value="All">{t('directory.allCategories')}</option>
            <option value="Wedding">{t('directory.catWedding')}</option>
            <option value="Pre-Wedding">{t('directory.catPreWedding')}</option>
            <option value="Corporate">{t('directory.catCorporate')}</option>
            <option value="Product">{t('directory.catProduct')}</option>
            <option value="Fashion">{t('directory.catFashion')}</option>
            <option value="Commercial">{t('directory.catCommercial')}</option>
            <option value="Maternity">{t('directory.catMaternity')}</option>
            <option value="Real Estate">{t('directory.catRealEstate')}</option>
            <option value="Food">{t('directory.catFood')}</option>
            <option value="Portrait">{t('directory.catPortrait')}</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="relative group">
          <Star className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
          <select
            value={minRatingFilter}
            onChange={(e) => setMinRatingFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-amber-500/60 focus:bg-slate-900 transition-colors appearance-none"
          >
            <option value="All">{t('directory.anyRating')}</option>
            <option value="4.8">{t('directory.topRated')}</option>
            <option value="4.9">{t('directory.elite')}</option>
            <option value="5.0">{t('directory.perfect')}</option>
          </select>
        </div>
      </div>

      {/* Grid of Photographers / Studios */}
      {(directoryType === 'individuals' ? filteredPhotographers : filteredStudios).length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl animate-fade-in">
          <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-serif">{t('directory.noArtists')}</h3>
          <p className="text-slate-400 text-sm font-light">{t('directory.tryAdjusting')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(directoryType === 'individuals' ? filteredPhotographers : filteredStudios).map((p, idx) => (
            <div
              key={p.photographer_id || p.studio_id}
              className="glass-card overflow-hidden hover:-translate-y-2 hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-between group animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden">
                  <img src={p.cover_image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {directoryType === 'studios' && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                       <img src={p.logo_image} alt={t('photographersDirectory.logo')} className="w-12 h-12 rounded-lg border-2 border-slate-800 shadow-xl object-cover" />
                       <div className="flex flex-col">
                         <span className="text-white font-bold text-sm bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-sm">{t('photographersDirectory.teamOfPTeamsize')}</span>
                         <span className="text-amber-400 text-xs font-bold drop-shadow-md">{p.completed_events}+ Events</span>
                       </div>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-amber-400 text-sm font-bold shadow-xl">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{p.rating}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors font-serif">{p.name}</h3>
                        {p.is_verified && <CheckCircle className="w-4 h-4 text-blue-400" title={t('directory.verified')} />}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 flex items-start gap-1.5 font-light">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2" title={p.location}>
                          {p.location.includes(',') ? (
                            <>
                              <span className="text-slate-300 font-medium">{p.location.split(',').pop().trim()}</span>
                              <span className="mx-1.5 opacity-50">|</span>
                              {p.location.substring(0, p.location.lastIndexOf(',')).trim()}
                            </>
                          ) : p.location}
                        </span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t('directory.startsAt')}</p>
                      <p className="text-base font-extrabold text-amber-400 font-serif">₹{p.price_per_hour}<span className="text-xs text-slate-500 font-sans">{t('directory.perHr')}</span></p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed font-light">{p.bio}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.specialties?.map((spec, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800/50 text-xs font-medium text-slate-300 border border-slate-700/50">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if(directoryType === 'individuals') {
                        navigateToTab('profile', null, { id: p.photographer_id });
                      } else {
                        navigateToTab('studioprofile', null, { id: p.studio_id });
                      }
                    }}
                    className="flex-1 py-3 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors border border-slate-700"
                  >
                    {directoryType === 'individuals' ? t('directory.viewDetails') : 'View Studio'}
                  </button>
                  <button 
                    onClick={() => navigateToTab('checkout', null, { photographerId: p.photographer_id, studioId: p.studio_id })}
                    className="flex-1 py-3 text-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
                  >
                    {t('directory.bookNow')}
                  </button>
                </div>
                {directoryType === 'individuals' && (
                  <button
                    onClick={(e) => toggleCompare(e, p.photographer_id)}
                    className={`w-full py-3 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                      compareIds.includes(p.photographer_id)
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                        : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{compareIds.includes(p.photographer_id) ? t('directory.addedToCompare') : t('directory.compare')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
