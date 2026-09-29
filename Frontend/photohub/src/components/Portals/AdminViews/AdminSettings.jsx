import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Shield, Server, CreditCard, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../utils/api';

export const AdminSettings = () => {
  const { t } = useTranslation();

  const [settings, setSettings] = useState({
    platformName: '',
    supportEmail: '',
    maintenanceMode: false,
    autoApprovePhotographers: false,
    requireEmailVerification: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(res => setSettings(res.data)).catch(console.error);
  }, []);

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const handleChange = (e) => setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success(t('adminSettings.configurationSaved') || 'Configuration saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminSettings.platformSettings')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminSettings.configureGlobalApp')}</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Configuration
        </button>
      </div>

      <div className="space-y-6">
        
        {/* General Settings */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('adminSettings.generalConfiguratio')}</h3>
              <p className="text-xs text-slate-400">{t('adminSettings.corePlatformBehavi')}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('adminSettings.platformName')}</label>
                <input 
                  type="text" 
                  name="platformName"
                  value={settings.platformName}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('adminSettings.supportEmail')}</label>
                <input 
                  type="email" 
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-200">{t('adminSettings.maintenanceMode')}</p>
                <p className="text-xs text-slate-500">{t('adminSettings.temporarilyDisable')}</p>
              </div>
              <button onClick={() => toggle('maintenanceMode')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('adminSettings.securityAccess')}</h3>
              <p className="text-xs text-slate-400">{t('adminSettings.userVerificationAn')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-200">{t('adminSettings.requireEmailVerifi')}</p>
                <p className="text-xs text-slate-500">{t('adminSettings.usersMustVerifyTh')}</p>
              </div>
              <button onClick={() => toggle('requireEmailVerification')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.requireEmailVerification ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.requireEmailVerification ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-200">{t('adminSettings.autoApprovePhotogr')}</p>
                <p className="text-xs text-slate-500">{t('adminSettings.skipManualReviewF')}</p>
              </div>
              <button onClick={() => toggle('autoApprovePhotographers')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoApprovePhotographers ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.autoApprovePhotographers ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Billing & Fees */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('adminSettings.billingFees')}</h3>
              <p className="text-xs text-slate-400">{t('adminSettings.platformCommissions')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('adminSettings.globalPlatformFee')}</label>
              <input 
                type="number" 
                defaultValue="15"
                className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('adminSettings.defaultTaxRate')}</label>
              <input 
                type="number" 
                defaultValue="18"
                className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
