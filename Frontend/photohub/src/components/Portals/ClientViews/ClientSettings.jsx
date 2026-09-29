import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Lock, Globe, Shield, Smartphone } from 'lucide-react';

export const ClientSettings = () => {
  const { t } = useTranslation();

  const [settings, setSettings] = useState({
    emailNotif: true,
    smsNotif: false,
    promotions: true,
    twoFactor: false,
    publicProfile: false
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientSettings.settings')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientSettings.manageYourPreferen')}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('clientSettings.notifications')}</h3>
              <p className="text-xs text-slate-400">{t('clientSettings.chooseHowYouWant')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">{t('clientSettings.emailNotifications')}</p>
                <p className="text-xs text-slate-500">{t('clientSettings.receiveBookingUpda')}</p>
              </div>
              <button onClick={() => toggle('emailNotif')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailNotif ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.emailNotif ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">SMS Alerts <span className="px-2 py-0.5 ml-2 rounded text-[10px] bg-slate-800 text-slate-400 font-bold uppercase">{t('clientSettings.pro')}</span></p>
                <p className="text-xs text-slate-500">{t('clientSettings.getInstantTextMes')}</p>
              </div>
              <button onClick={() => toggle('smsNotif')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.smsNotif ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.smsNotif ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">{t('clientSettings.promotionalOffers')}</p>
                <p className="text-xs text-slate-500">{t('clientSettings.receiveMarketingEm')}</p>
              </div>
              <button onClick={() => toggle('promotions')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.promotions ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.promotions ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('clientSettings.securityPrivacy')}</h3>
              <p className="text-xs text-slate-400">{t('clientSettings.keepYourAccountSe')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">{t('clientSettings.twoFactorAuthentic')}</p>
                <p className="text-xs text-slate-500">{t('clientSettings.addAnExtraLayerO')}</p>
              </div>
              <button onClick={() => toggle('twoFactor')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.twoFactor ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.twoFactor ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            <div className="pt-4 mt-4 border-t border-slate-800/50">
              <button 
                onClick={() => alert("Password reset instructions have been sent to your registered email address.")}
                className="text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700"
              >
                {t('clientSettings.changePassword')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
