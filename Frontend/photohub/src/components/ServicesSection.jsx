import React from 'react';
import { Camera, Heart, Users, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const SERVICES_LIST = [
  {
    id: 'wedding',
    titleKey: 'services.s1Title',
    descKey: 'services.s1Desc',
    image: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg',
    icon: Heart,
    color: 'from-amber-500/20 to-pink-500/20',
    badgeKey: 'services.s1Badge'
  },
  {
    id: 'event',
    titleKey: 'services.s2Title',
    descKey: 'services.s2Desc',
    image: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg',
    icon: Users,
    color: 'from-blue-500/20 to-indigo-500/20',
    badgeKey: 'services.s2Badge'
  },
  {
    id: 'maternity',
    titleKey: 'services.s3Title',
    descKey: 'services.s3Desc',
    image: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg',
    icon: Sparkles,
    color: 'from-rose-500/20 to-purple-500/20',
    badgeKey: 'services.s3Badge'
  },
  {
    id: 'portrait',
    titleKey: 'services.s4Title',
    descKey: 'services.s4Desc',
    image: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg',
    icon: Camera,
    color: 'from-amber-500/20 to-yellow-500/20',
    badgeKey: 'services.s4Badge'
  },
  {
    id: 'product',
    titleKey: 'services.s5Title',
    descKey: 'services.s5Desc',
    image: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg',
    icon: ShoppingBag,
    color: 'from-emerald-500/20 to-teal-500/20',
    badgeKey: 'services.s5Badge'
  }
];

export const ServicesSection = () => {
  const { navigateToTab } = useApp();
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#0b0e14] relative border-t border-slate-800/60 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-20 animate-slide-up">
          <p className="section-label">
            {t('services.whatWeOffer')}
          </p>
          <h2 className="section-heading font-serif">
            {t('services.heading1')} <span className="text-gradient-amber italic">{t('services.heading2')}</span>
          </h2>
          <p className="text-slate-400 text-base font-light leading-relaxed max-w-2xl mx-auto">
            {t('services.subtext')}
          </p>
        </div>

        {/* 5 Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {SERVICES_LIST.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => navigateToTab('photographers', { category: service.title })}
                className="group relative glass-card hover:border-amber-500/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xl border border-slate-700/80 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {t(service.badgeKey)}
                    </span>

                    <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-amber-400 shadow-xl group-hover:bg-amber-500/20 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 space-y-2.5 text-left">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-serif">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {t(service.descKey)}
                    </p>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="px-5 pb-5 pt-2 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-2 transition-transform duration-300">
                  <span>{t('services.explorePortfolio')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
