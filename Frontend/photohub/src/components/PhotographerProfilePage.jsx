import React from 'react';
import { Star, MapPin, IndianRupee, Camera, CalendarCheck, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const PhotographerProfilePage = () => {
  const { activeTabParams, photographers, packages, portfolio, reviews, navigateToTab } = useApp();
  const { t } = useTranslation();
  
  const id = activeTabParams?.id;
  const photographer = photographers.find(p => p.photographer_id === id);

  const photographerPortfolio = portfolio.filter(p => p.photographer_id === id);
  const photographerPackages = packages.filter(p => p.photographer_id === id);
  const photographerReviews = reviews.filter(r => r.photographer_id === id);

  if (!photographer) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-rose-500">{t('profile.notFound')}</h2>
          <button onClick={() => navigateToTab('photographers')} className="btn-amber px-6 py-2">{t('profile.backDir')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] pt-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] w-full bg-slate-900 border-b border-slate-800">
        <img 
          src={photographer.cover_image || "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg"} 
          alt={t('photographerProfilePage.cover')} 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 pb-24">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Photo */}
          <div className="w-48 h-48 rounded-3xl border-4 border-[#0b0e14] shadow-2xl overflow-hidden bg-slate-800 flex-shrink-0">
            <img 
              src={photographer.profile_picture || "/images/faces/faces-3.webp"} 
              alt={photographer.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4 pt-4 md:pt-12">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-serif font-black text-white">{photographer.name}</h1>
              {photographer.is_verified && (
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded font-bold border border-amber-500/30">{t('profile.verified')}</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-amber-500" /> {photographer.location}</div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> {photographer.rating} {t('profile.rating')}</div>
              <div className="flex items-center gap-1"><IndianRupee className="w-4 h-4 text-amber-500" /> {photographer.price_per_hour}{t('profile.perHr')}</div>
            </div>

            <p className="text-slate-300 font-light leading-relaxed max-w-2xl">{photographer.bio}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {photographer.specialties?.map(s => (
                <span key={s} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-semibold border border-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div className="w-full md:w-80 glass-card p-6 space-y-6 md:mt-12 text-center md:text-left h-fit sticky top-24">
            <div className="space-y-2">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{t('profile.startingAt')}</p>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <IndianRupee className="w-6 h-6 text-amber-400" />
                <span className="text-3xl font-black text-white">{photographer.price_per_hour * 4}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigateToTab('checkout', null, { photographerId: photographer.photographer_id })}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" />
              {t('profile.bookNow')}
            </button>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
            <Camera className="text-amber-500" /> {t('profile.portfolio')}
          </h2>
          {photographerPortfolio.length === 0 ? (
            <p className="text-slate-400">{t('profile.noPortfolio')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {photographerPortfolio.map(item => (
                <div key={item.portfolio_id} className="relative group overflow-hidden rounded-xl h-64 bg-slate-800">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition duration-300 translate-y-4 group-hover:translate-y-0">
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">{item.category}</p>
                    <p className="text-white font-bold">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Packages Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">{t('profile.servicePackages')}</h2>
          {photographerPackages.length === 0 ? (
            <p className="text-slate-400">{t('profile.noPackages')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {photographerPackages.map(pkg => (
                <div key={pkg.package_id} className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-amber-500/50 transition flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <p className="text-slate-400 text-sm mb-6 h-12 overflow-hidden">{pkg.description}</p>
                    <div className="text-4xl font-extrabold text-amber-500 mb-8 flex items-end gap-1">
                      <IndianRupee className="w-6 h-6 mb-1"/>{pkg.price}
                    </div>
                    <ul className="space-y-4 mb-8 text-slate-300 text-sm">
                      <li className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> {pkg.duration_hours} {t('profile.hoursCoverage')}
                      </li>
                      {(typeof pkg.features === 'string' ? pkg.features.split(',').map(f => f.trim()) : pkg.features || [])?.map((feature, i) => (
                        <li key={i} className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => navigateToTab('checkout', null, { photographerId: photographer.photographer_id, packageId: pkg.package_id })} className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition">
                    {t('profile.selectPackage')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">{t('profile.clientReviews')}</h2>
          {photographerReviews.length === 0 ? (
            <p className="text-slate-400">{t('profile.noReviews')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {photographerReviews.map(review => (
                <div key={review.review_id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img src={review.user_avatar || "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg"} alt={t('photographerProfilePage.avatar')} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-white font-bold text-sm">{review.user_name || t('profile.verifiedClient')}</p>
                        <p className="text-slate-500 text-xs">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-amber-500/10 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                      <span className="text-amber-500 font-bold text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
