import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const VendorComparator = ({ isOpen, onClose, selectedIds }) => {
  const { photographers, packages } = useApp();
  const { t } = useTranslation();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedIds.length > 0) {
      setLoading(true);
      // Simulate a small loading delay for UI feel
      setTimeout(() => {
        const selectedVendors = selectedIds.map(id => {
          const p = photographers.find(photo => photo.photographer_id === id);
          if (!p) return null;
          
          const pPackages = packages.filter(pkg => pkg.photographer_id === id);
          
          return {
            _id: p.photographer_id,
            name: p.name,
            avatar: p.profile_picture || '/images/faces/faces-3.webp', // avatar is not directly in photographer object
            aestheticStyle: p.specialties?.[0] || 'Candid & Traditional',
            hourlyRate: p.price_per_hour,
            packages: pPackages
          };
        }).filter(Boolean);
        
        setVendors(selectedVendors);
        setLoading(false);
      }, 400);
    }
  }, [isOpen, selectedIds, photographers, packages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">{t('comparator.title')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-slate-950/50 p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-flow-col auto-cols-fr gap-6">
              <div className="space-y-6 pt-48 hidden md:block border-r border-slate-800 pr-4">
                <div className="h-16 flex items-center text-slate-400 font-medium">{t('comparator.startingPrice')}</div>
                <div className="h-16 flex items-center text-slate-400 font-medium">{t('comparator.ratingReviews')}</div>
                <div className="h-16 flex items-center text-slate-400 font-medium">{t('comparator.style')}</div>
                <div className="h-24 flex items-center text-slate-400 font-medium">{t('comparator.deliverables')}</div>
                <div className="h-16 flex items-center text-slate-400 font-medium">{t('comparator.hourlyRate')}</div>
              </div>

              {vendors.map((vendor) => (
                <div key={vendor._id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col">
                  <div className="flex flex-col items-center text-center mb-8 h-40">
                    <img src={vendor.avatar} alt={vendor.name} className="w-20 h-20 rounded-full object-cover mb-3 shadow-md border-2 border-slate-600" />
                    <h3 className="font-bold text-lg text-white">{vendor.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{vendor.city}</p>
                    <button 
                      onClick={() => { onClose(); }}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-lg font-bold hover:scale-[1.02] transition-transform"
                    >
                      {t('comparator.bookVendor')}
                    </button>
                  </div>

                  <div className="space-y-6 divide-y divide-slate-700/50">
                    <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between h-auto md:h-12">
                      <span className="text-sm text-slate-400 md:hidden mb-1">{t('comparator.startingPrice')}</span>
                      <span className="font-bold text-lg text-white">₹{vendor.startingPrice?.toLocaleString() || t('comparator.na')}</span>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between h-auto md:h-12">
                      <span className="text-sm text-slate-400 md:hidden mb-1">{t('comparator.rating')}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-amber-400">{vendor.rating} ★</span>
                        <span className="text-sm text-slate-500">({vendor.reviewCount})</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between h-auto md:h-12">
                      <span className="text-sm text-slate-400 md:hidden mb-1">{t('comparator.style')}</span>
                      <span className="text-sm font-medium text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">{vendor.aestheticStyle}</span>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row justify-between h-auto md:h-24">
                      <span className="text-sm text-slate-400 md:hidden mb-1">{t('comparator.deliverables')}</span>
                      <div className="space-y-2 text-sm text-slate-300">
                        {(typeof vendor.packages?.[0]?.features === 'string'
                          ? vendor.packages[0].features.split(',')
                          : vendor.packages?.[0]?.features
                        )?.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>{typeof item === 'string' ? item.trim() : item}</span>
                          </div>
                        )) || <span className="text-slate-500 italic">{t('comparator.noPackages')}</span>}
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between h-auto md:h-12">
                      <span className="text-sm text-slate-400 md:hidden mb-1">{t('comparator.hourlyRate')}</span>
                      <span className="font-medium text-slate-300">₹{vendor.hourlyRate?.toLocaleString() || t('comparator.na')}{t('comparator.perHr')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorComparator;
