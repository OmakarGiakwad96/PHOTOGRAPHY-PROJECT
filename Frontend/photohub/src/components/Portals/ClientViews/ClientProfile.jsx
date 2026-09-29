import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Mail, User, Phone, MapPin } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const ClientProfile = () => {
  const { t } = useTranslation();

  const { currentUser } = useApp();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    alert(t('clientProfile.profileUpdatedSucc'));
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientProfile.myProfile')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientProfile.manageYourPersonal')}</p>
        </div>
      </div>

      <div className="glass-card p-8 sm:p-10 border border-slate-700/60 rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-800/80">
            <div className="relative group cursor-pointer">
              <img 
                src={currentUser?.profile_picture || "/images/faces/faces-3.webp"} 
                alt={currentUser?.name} 
                className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-amber-500 transition-colors"
              />
              <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-white mb-1">{t('clientProfile.profilePicture')}</h3>
              <p className="text-xs text-slate-400 mb-3">{t('clientProfile.jPGGIFOrPNGMax')}</p>
              <button type="button" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors border border-slate-700">
                {t('clientProfile.uploadNew')}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('clientProfile.fullName')}</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('clientProfile.emailAddress')}</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('clientProfile.phoneNumber')}</label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('clientProfile.cityLocation')}</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={t('clientProfile.eGMumbaiMH')}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex justify-end">
            <button type="submit" className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors shadow-lg shadow-amber-500/20">
              {t('clientProfile.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
