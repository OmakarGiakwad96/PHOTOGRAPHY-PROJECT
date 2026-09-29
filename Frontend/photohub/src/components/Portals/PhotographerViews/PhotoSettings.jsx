import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Globe, Calendar, DollarSign, Bell } from 'lucide-react';

export const PhotoSettings = () => {
  const { t } = useTranslation();

  const [settings, setSettings] = useState({
    acceptRequests: true,
    showPricing: true,
    smsAlerts: false,
    autoConfirm: false,
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoSettings.settings')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoSettings.manageYourBusiness')}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Availability & Booking */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('photoSettings.bookingPreferences')}</h3>
              <p className="text-xs text-slate-400">{t('photoSettings.controlHowClients')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">{t('photoSettings.acceptNewRequests')}</p>
                <p className="text-xs text-slate-500">{t('photoSettings.temporarilyPauseIn')}</p>
              </div>
              <button onClick={() => toggle('acceptRequests')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.acceptRequests ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.acceptRequests ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">Auto-Confirm Bookings <span className="px-2 py-0.5 ml-2 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold uppercase">{t('photoSettings.pro')}</span></p>
                <p className="text-xs text-slate-500">{t('photoSettings.automaticallyAccept')}</p>
              </div>
              <button onClick={() => toggle('autoConfirm')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoConfirm ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.autoConfirm ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Profile & Pricing */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('photoSettings.publicProfile')}</h3>
              <p className="text-xs text-slate-400">{t('photoSettings.controlWhatClients')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">{t('photoSettings.showPricingPublicl')}</p>
                <p className="text-xs text-slate-500">{t('photoSettings.displayYourBasePa')}</p>
              </div>
              <button onClick={() => toggle('showPricing')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.showPricing ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.showPricing ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/50">
              <button className="text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Edit Pricing Packages
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('photoSettings.notifications')}</h3>
              <p className="text-xs text-slate-400">{t('photoSettings.howWeContactYou')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">{t('photoSettings.sMSAlerts')}</p>
                <p className="text-xs text-slate-500">{t('photoSettings.getTextMessagesFo')}</p>
              </div>
              <button onClick={() => toggle('smsAlerts')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.smsAlerts ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.smsAlerts ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
