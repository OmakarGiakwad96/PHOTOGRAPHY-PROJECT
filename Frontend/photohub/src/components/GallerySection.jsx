import React, { useState } from 'react';
import { Camera, Filter, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const GallerySection = () => {
  const { portfolio, photographers } = useApp();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightbox, setActiveLightbox] = useState(null);

  const categories = ['All', 'Wedding', 'Pre-Wedding', 'Corporate', 'Product', 'Fashion', 'Commercial', 'Maternity & Newborn', 'Real Estate', 'Food', 'Portrait'];

  const filteredItems = selectedCategory === 'All'
    ? portfolio
    : portfolio.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          {t('gallery.subtitle')}
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {t('gallery.title')}
        </h1>
        <p className="text-slate-400 text-sm">
          {t('gallery.desc')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t(`gallery.cat_${cat}`, { defaultValue: cat })}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const photographer = photographers.find(p => p.photographer_id === item.photographer_id);
          return (
            <div
              key={item.portfolio_id}
              onClick={() => setActiveLightbox(item)}
              className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer border border-slate-800 shadow-xl"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition" />

              <div className="absolute bottom-4 left-4 right-4 text-left space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase">
                  {t(`gallery.cat_${item.category}`) || item.category}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                  {item.title}
                </h3>
                {photographer && (
                  <p className="text-xs text-slate-300">{t('gallery.by')}{photographer.name}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeLightbox.image_url}
              alt={activeLightbox.title}
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />

            <div className="flex items-center justify-between px-2 pt-2 text-left">
              <div>
                <h3 className="text-xl font-bold text-white">{activeLightbox.title}</h3>
                <p className="text-xs text-amber-400 font-semibold">{activeLightbox.category} Photography</p>
              </div>
              <button
                onClick={() => setActiveLightbox(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
