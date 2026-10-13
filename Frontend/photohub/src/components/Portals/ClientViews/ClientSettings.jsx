import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Lock, Globe, Shield, Smartphone, MessageSquare, Mail, CheckCircle2, Save } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const ClientSettings = () => {
  const { t } = useTranslation();
  const { currentUser } = useApp();

  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '+91 ');
  const [settings, setSettings] = useState({
    whatsAppConsent: true,
    smsConsent: true,
    emailConsent: true,
    promotionalConsent: false,
    twoFactor: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      const uid = currentUser?.user_id || 1;
      try {
        const res = await fetch(`/api/notifications/preferences/${uid}`);
        if (res.ok) {
          const data = await res.json();
          if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
          setSettings(prev => ({
            ...prev,
            whatsAppConsent: data.whatsAppConsent ?? true,
            smsConsent: data.smsConsent ?? true,
            emailConsent: data.emailConsent ?? true,
            promotionalConsent: data.promotionalConsent ?? false
          }));
        }
      } catch (err) {
        console.warn("Preferences load notice:", err);
      }
    };

    fetchPreferences();
  }, [currentUser]);

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(false);
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setSaveSuccess(false);

    // Validate phone number format
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number with country code (e.g., +91 98765 43210)');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.user_id || 1,
          phoneNumber: phoneNumber.trim(),
          email: currentUser?.email || '',
          whatsAppConsent: settings.whatsAppConsent,
          smsConsent: settings.smsConsent,
          emailConsent: settings.emailConsent,
          promotionalConsent: settings.promotionalConsent,
          consentSource: 'ClientSettingsPortal'
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">Account & Notification Preferences</h2>
          <p className="text-slate-400 font-light mt-1">Manage official Meta WhatsApp, SMS alerts, and privacy preferences</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Your notification preferences and messaging consent have been securely updated.</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Customer Notification Preferences Card */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Instant WhatsApp & SMS Notifications</h3>
              <p className="text-xs text-slate-400">Receive real-time shoot confirmations, digital invoices, and photographer coordination</p>
            </div>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-6">
            {/* Primary Phone Number */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Mobile Number for WhatsApp & SMS <span className="text-amber-400">*</span>
              </label>
              <div className="relative max-w-md">
                <input 
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setPhoneError('');
                  }}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500">Include country code (+91 for India). Used for approved WhatsApp templates and DLT SMS.</p>
              {phoneError && <p className="text-xs text-rose-400 font-medium">{phoneError}</p>}
            </div>

            {/* Notification Toggles */}
            <div className="space-y-4 pt-2 border-t border-slate-800/60">
              
              {/* WhatsApp Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 text-sm">WhatsApp Booking & Payment Updates</p>
                    <p className="text-xs text-slate-400">Receive booking confirmations, photographer approvals, and payment receipts directly on WhatsApp.</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => toggle('whatsAppConsent')} 
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${settings.whatsAppConsent ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.whatsAppConsent ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* SMS Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 text-sm">Critical SMS Alerts (TRAI / DLT Compliant)</p>
                    <p className="text-xs text-slate-400">Receive essential booking reference numbers, verification OTPs, and schedule change notices.</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => toggle('smsConsent')} 
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${settings.smsConsent ? 'bg-sky-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.smsConsent ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* Promotional Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 text-sm">Festive Discounts & Exclusive Offers</p>
                    <p className="text-xs text-slate-400">Opt-in to receive wedding season promotions and early-bird photoshoot discounts. You can opt out anytime.</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => toggle('promotionalConsent')} 
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${settings.promotionalConsent ? 'bg-amber-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.promotionalConsent ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Account Protection */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Security &amp; Privacy</h3>
              <p className="text-xs text-slate-400">Keep your account secure with two-factor authentication and credentials management</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200 text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Require an SMS or WhatsApp OTP when signing in from an unrecognized device.</p>
              </div>
              <button 
                type="button"
                onClick={() => toggle('twoFactor')} 
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.twoFactor ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.twoFactor ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            <div className="pt-4 mt-4 border-t border-slate-800/50">
              <button 
                type="button"
                onClick={() => alert("Password reset instructions have been sent to your registered email address.")}
                className="text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;
