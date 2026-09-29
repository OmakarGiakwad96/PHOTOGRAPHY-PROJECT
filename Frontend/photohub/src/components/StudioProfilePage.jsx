import React from 'react';
import { Star, MapPin, IndianRupee, Camera, CalendarCheck, CheckCircle, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const StudioProfilePage = () => {
  const { activeTabParams, studios, packages, portfolio, reviews, navigateToTab } = useApp();
  const { t } = useTranslation();
  
  const id = activeTabParams?.id;
  const studio = studios.find(s => s.studio_id === id);

  // We reuse portfolio and packages for studios (mock data matches by owner_id or just mock it)
  // For now, in our mock data, studios have owner_id. Let's just mock some packages/portfolio if not found
  const studioPortfolio = portfolio.filter(p => p.photographer_id === studio?.owner_id) || [];
  const studioPackages = packages.filter(p => p.photographer_id === studio?.owner_id) || [];
  const studioReviews = reviews.filter(r => r.photographer_id === studio?.owner_id) || [];

  if (!studio) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-rose-500">{t('studioProfilePage.studioNotFound')}</h2>
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
          src={studio.cover_image || "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg"} 
          alt={t('studioProfilePage.cover')} 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 pb-24">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Photo */}
          <div className="w-48 h-48 rounded-3xl border-4 border-[#0b0e14] shadow-2xl overflow-hidden bg-slate-800 flex-shrink-0 relative">
            <img 
              src={studio.logo_image || "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg"} 
              alt={studio.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm text-center py-1">
               <span className="text-xs font-bold text-amber-400">{t('studioProfilePage.sTUDIO')}</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4 pt-4 md:pt-12">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-serif font-black text-white">{studio.name}</h1>
              {studio.is_verified && (
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded font-bold border border-amber-500/30">{t('profile.verified')}</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-amber-500" /> {studio.location}</div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> {studio.rating} {t('profile.rating')}</div>
              <div className="flex items-center gap-1"><Users className="w-4 h-4 text-amber-500" /> {studio.team_size} Team Members</div>
              <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-amber-500" /> {studio.completed_events}+ Events</div>
            </div>

            <p className="text-slate-300 font-light leading-relaxed max-w-2xl">{studio.bio}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {studio.specialties?.map(s => (
                <span key={s} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-semibold border border-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div className="w-full md:w-80 glass-card p-6 space-y-6 md:mt-12 text-center md:text-left h-fit sticky top-24 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
            <div className="space-y-2">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{t('studioProfilePage.bookTeamStartingA')}</p>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <IndianRupee className="w-6 h-6 text-amber-400" />
                <span className="text-3xl font-black text-white">{studio.price_per_hour * 8}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigateToTab('checkout', null, { studioId: studio.studio_id })}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" />
              {t('studioProfilePage.bookStudioTeam')}
            </button>
          </div>
        </div>

        {/* Meet the Team Preview (Phase 1 Stub) */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
            <Users className="text-amber-500" /> Meet the Team
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
             {/* Stubs for team members */}
             {[
               {name: 'Rahul S.', role: 'Lead Photographer'},
               {name: 'Priya M.', role: 'Cinematographer'},
               {name: 'Aman D.', role: 'Drone Pilot'},
               {name: 'Neha K.', role: 'Photo Editor'},
             ].map((member, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                    <img src={`/images/faces/faces-${i % 3 + 1}.webp`} className="w-16 h-16 rounded-full mx-auto mb-3" alt={member.name} />
                   <h4 className="text-white font-bold text-sm">{member.name}</h4>
                   <p className="text-amber-500 text-xs">{member.role}</p>
                </div>
             ))}
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4 flex items-center gap-2">
            <Camera className="text-amber-500" /> Studio Portfolio
          </h2>
          {studioPortfolio.length === 0 ? (
            <p className="text-slate-400">{t('profile.noPortfolio')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {studioPortfolio.map(item => (
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
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">{t('studioProfilePage.studioPackages')}</h2>
          {studioPackages.length === 0 ? (
            <p className="text-slate-400">{t('profile.noPackages')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studioPackages.map(pkg => (
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
                  <button onClick={() => navigateToTab('checkout', null, { studioId: studio.studio_id, packageId: pkg.package_id })} className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition">
                    {t('profile.selectPackage')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
