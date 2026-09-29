import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Search, MoreVertical, ShieldCheck, Mail, IndianRupee, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import toast from 'react-hot-toast';

export const AdminPhotographers = () => {
  const { t } = useTranslation();

  const { photographers, verifyPhotographer, setPhotographers } = useApp();
  const [localPhotographers, setLocalPhotographers] = useState(photographers);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProData, setNewProData] = useState({
    name: '', email: '', phone: '', location: '', specialties: '', price_per_hour: '', experience: ''
  });

  useEffect(() => {
    setLocalPhotographers(photographers);
  }, [photographers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProData(prev => ({ ...prev, [name]: value }));
  };

  const submitNewPhotographer = (e) => {
    e.preventDefault();
    if (!newProData.name || !newProData.email) {
      toast.error('Name and Email are required');
      return;
    }

    const newUserId = Date.now();
    const newPhotographer = {
      photographer_id: newUserId + 100,
      user_id: newUserId,
      name: newProData.name,
      location: newProData.location || 'Not Specified',
      specialties: newProData.specialties ? newProData.specialties.split(',').map(s => s.trim()) : ['General'],
      price_per_hour: parseFloat(newProData.price_per_hour) || 0,
      experience: parseInt(newProData.experience) || 0,
      rating: 5.0,
      is_verified: true, // Verified by default since Admin adds them
      cover_image: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg',
      profile_picture: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg',
    };

    setPhotographers([newPhotographer, ...photographers]);
    toast.success('New photographer registered successfully!');
    setIsAddModalOpen(false);
    setNewProData({ name: '', email: '', phone: '', location: '', specialties: '', price_per_hour: '', experience: '' });
  };

  const handleRemovePhotographer = (id) => {
    setPhotographers(photographers.filter(p => (p.photographer_id || p.id) !== id));
    toast.success('Photographer account removed.');
  };

  const filteredPhotographers = localPhotographers.filter(pro =>
    pro.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminPhotographers.photographerDirecto')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminPhotographers.manageProfessionals')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('adminPhotographers.searchPhotographers')}
              className="w-full sm:w-64 bg-slate-900 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Pro
          </button>
        </div>
      </div>

      <div className="glass-card border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-bold tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">{t('adminPhotographers.photographer')}</th>
                <th className="px-6 py-4">{t('adminPhotographers.category')}</th>
                <th className="px-6 py-4">{t('adminPhotographers.pricing')}</th>
                <th className="px-6 py-4 text-center">{t('adminPhotographers.verification')}</th>
                <th className="px-6 py-4 text-right">{t('adminPhotographers.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
              {filteredPhotographers.length > 0 ? filteredPhotographers.map((pro) => (
                <tr key={pro.photographer_id || pro.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={pro.profile_picture || pro.cover_image || 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg'} alt={pro.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1">
                          {pro.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{pro.location || 'Unknown Location'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 bg-slate-800 px-2 py-1 rounded text-xs">{pro.specialties ? pro.specialties.join(', ') : 'None'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-amber-400">₹{pro.price_per_hour || pro.pricing || 0}/hr</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {pro.is_verified ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner bg-emerald-500/10 border-emerald-500/30 text-emerald-400 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {t('adminPhotographers.verified')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner bg-slate-800 border-slate-700 text-slate-400">
                        {t('adminPhotographers.pending')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => verifyPhotographer(pro.photographer_id || pro.id)}
                        className={`p-2 transition-colors ${pro.is_verified ? 'text-amber-500 hover:text-amber-400' : 'text-emerald-500 hover:text-emerald-400'}`}
                        title={pro.is_verified ? "Revoke Verification" : "Approve Photographer"}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemovePhotographer(pro.photographer_id || pro.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Reject/Remove Photographer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No photographers found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/60 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-xl font-bold text-white font-serif">Register New Photographer</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitNewPhotographer} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newProData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={newProData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={newProData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newProData.location}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specialties (comma separated)</label>
                  <input
                    type="text"
                    name="specialties"
                    value={newProData.specialties}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price Per Hour (₹)</label>
                  <input
                    type="number"
                    name="price_per_hour"
                    value={newProData.price_per_hour}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-colors"
                >
                  Register Photographer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
