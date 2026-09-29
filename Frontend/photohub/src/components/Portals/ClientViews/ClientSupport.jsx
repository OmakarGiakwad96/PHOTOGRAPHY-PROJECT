import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Mail, MessageSquare, PhoneCall } from 'lucide-react';

export const ClientSupport = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ subject: '', message: '' });

  const handleSubmit = (e) => {

    e.preventDefault();
    alert(t('clientSupport.supportTicketSubmi'));
    setFormData({ subject: '', message: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientSupport.helpSupport')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientSupport.getAssistanceWith')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-slate-700/60 rounded-3xl hover:border-amber-500/30 transition-colors group">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
              <Mail className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-white font-bold mb-1">{t('clientSupport.emailSupport')}</h3>
            <p className="text-sm text-slate-400 mb-2">{t('clientSupport.typicallyRepliesIn')}</p>
            <a href="mailto:support@photohub.com" className="text-amber-400 text-sm font-semibold hover:underline">{t('clientSupport.supportPhotohubCom')}</a>
          </div>

          <div className="glass-card p-6 border border-slate-700/60 rounded-3xl hover:border-blue-500/30 transition-colors group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <PhoneCall className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-bold mb-1">{t('clientSupport.phoneSupport')}</h3>
            <p className="text-sm text-slate-400 mb-2">{t('clientSupport.availableMonFri9')}</p>
            <a href="tel:+919876543210" className="text-blue-400 text-sm font-semibold hover:underline">+91 98765 43210</a>
          </div>

          <div className="glass-card p-6 border border-slate-700/60 rounded-3xl hover:border-emerald-500/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-bold mb-1">{t('clientSupport.liveChat')}</h3>
            <p className="text-sm text-slate-400 mb-4">{t('clientSupport.chatWithOurSuppor')}</p>
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors border border-slate-700">
              {t('clientSupport.startChat')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-8 sm:p-10 border border-slate-700/60 rounded-3xl h-full">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-bold text-white font-serif">{t('clientSupport.sendUsAMessage')}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('clientSupport.subject')}</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t('clientSupport.whatDoYouNeedHel')}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('clientSupport.description')}</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('clientSupport.pleaseDescribeYour')}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none h-48 resize-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors shadow-lg shadow-amber-500/20">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
