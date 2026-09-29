import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, User, MapPin, Briefcase, Save, Image, CheckCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import toast from 'react-hot-toast';

export const PhotoProfileEdit = () => {
  const { t } = useTranslation();
  const { currentUser } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    studioName: 'Lens & Light Studio',
    bio: 'Professional photographer specializing in creating timeless memories. With over 5 years of experience in the industry, I strive to capture the authentic emotion of your special day.',
    cities: 'Mumbai, Pune',
    categories: 'Wedding, Portrait, Event',
    experienceYears: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to save profile
    setTimeout(() => {
      setLoading(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">My Profile</h2>
          <p className="text-slate-400 font-light mt-1">Manage your public photographer profile</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info Section */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Basic Information</h3>
              <p className="text-xs text-slate-400">Your core identity on PhotoHub</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Studio Name (Optional)</label>
              <input
                type="text"
                name="studioName"
                value={profile.studioName}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Services & Location Section */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Services & Location</h3>
              <p className="text-xs text-slate-400">Where and what you shoot</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cities Served (Comma separated)</label>
              <input
                type="text"
                name="cities"
                value={profile.cities}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Delhi, Pune"
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specialties (Comma separated)</label>
              <input
                type="text"
                name="categories"
                value={profile.categories}
                onChange={handleChange}
                placeholder="e.g. Wedding, Portrait, Commercial"
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Years of Experience</label>
              <input
                type="number"
                name="experienceYears"
                value={profile.experienceYears}
                onChange={handleChange}
                min="0"
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Branding Section */}
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Image className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Branding</h3>
              <p className="text-xs text-slate-400">Profile picture and banner</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <img 
              src={currentUser?.profile_picture || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-2 border-slate-700 object-cover"
            />
            <div className="space-y-3">
              <button type="button" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors border border-slate-700">
                Change Avatar
              </button>
              <p className="text-xs text-slate-500">Recommended size: 400x400px</p>
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50"
          >
            {loading ? <CheckCircle className="w-5 h-5 animate-pulse" /> : <Save className="w-5 h-5" />}
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
