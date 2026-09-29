import React from 'react';
import { Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { navigateToTab } = useApp();
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Camera className="w-4 h-4" />
              </div>
              <span>{t('footer.photoHub')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">{t('footer.explore')}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateToTab('home')} className="hover:text-amber-400">{t('footer.home')}</button></li>
              <li><button onClick={() => navigateToTab('services')} className="hover:text-amber-400">{t('footer.services')}</button></li>
              <li><button onClick={() => navigateToTab('photographers')} className="hover:text-amber-400">{t('footer.photographers')}</button></li>
              <li><button onClick={() => navigateToTab('packages')} className="hover:text-amber-400">{t('footer.packages')}</button></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">{t('footer.supportPolicy')}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateToTab('help')} className="hover:text-amber-400">{t('footer.helpCenter')}</button></li>
              <li><button onClick={() => navigateToTab('contact')} className="hover:text-amber-400">{t('footer.contactSupport')}</button></li>
              <li><button onClick={() => navigateToTab('legal')} className="hover:text-amber-400">{t('footer.terms')}</button></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">{t('footer.stayUpdated')}</h4>
            <p className="text-slate-400 text-xs mb-3">{t('footer.subscribe')}</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder={t('footer.enterEmail')}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
              />
              <button className="bg-amber-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-amber-400 transition">
                {t('footer.join')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-800">
          <p>{t('footer.rights')}</p>
          <div className="flex items-center gap-4 text-[10px]">
            <p>{t('footer.builtWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
