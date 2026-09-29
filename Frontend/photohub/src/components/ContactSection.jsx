import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ContactSection = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {

    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          {t('contact.subtitle')}
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {t('contact.title')}
        </h1>
        <p className="text-slate-400 text-sm">
          {t('contact.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-slate-900/90 p-8 rounded-2xl border border-slate-800 space-y-8">
          <h3 className="text-xl font-bold text-white">{t('contact.info')}</h3>
          
          <div className="space-y-6 text-sm text-slate-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">{t('contact.hq')}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t('contact.hqAddr')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">{t('contact.emailUs')}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t('contactSection.supportPhotohubCom')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">{t('contact.phoneSupport')}</p>
                <p className="text-xs text-slate-400 mt-0.5">+91 1800-123-7468</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900/90 p-8 rounded-2xl border border-slate-800">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">{t('contact.successTitle')}</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {t('contact.successDesc')}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold"
              >
                {t('contact.sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-bold text-white">{t('contact.sendDM')}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">{t('contact.yourName')}</label>
                  <input
                    required
                    type="text"
                    maxLength="50"
                    placeholder={t('contactSection.enterName')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">{t('contact.yourEmail')}</label>
                  <input
                    required
                    type="email"
                    maxLength="100"
                    placeholder={t('contactSection.enterEmail')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">{t('contact.subject')}</label>
                <input
                  required
                  type="text"
                  maxLength="100"
                  placeholder={t('contactSection.enterSubject')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">{t('contact.message')}</label>
                <textarea
                  required
                  rows="4"
                  maxLength="500"
                  placeholder={t('contactSection.enterMessage')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t('contact.submit')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
