import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, CheckCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const PhotoPackages = () => {
  const [packages, setPackages] = useState([
    { id: 1, title: 'Silver Wedding', price: 1500, duration: '8 Hours', deliverables: '500+ Edited Photos, Online Gallery' },
    { id: 2, title: 'Gold Wedding', price: 2500, duration: '12 Hours', deliverables: '800+ Edited Photos, 2nd Shooter, Premium Album' }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState({ title: '', price: '', duration: '', deliverables: '' });

  const handleAdd = () => {
    setCurrentPackage({ title: '', price: '', duration: '', deliverables: '' });
    setIsEditing(true);
  };

  const handleEdit = (pkg) => {
    setCurrentPackage(pkg);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setPackages(packages.filter(p => p.id !== id));
    toast.success('Package deleted successfully');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentPackage.id) {
      setPackages(packages.map(p => p.id === currentPackage.id ? currentPackage : p));
    } else {
      setPackages([...packages, { ...currentPackage, id: Date.now() }]);
    }
    setIsEditing(false);
    toast.success('Package saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">Packages & Pricing</h2>
          <p className="text-slate-400 font-light mt-1">Define the services you offer to clients</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Package
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
              {currentPackage.id ? 'Edit Package' : 'Create New Package'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Package Title</label>
                <input
                  type="text"
                  value={currentPackage.title}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, title: e.target.value })}
                  placeholder="e.g. Bronze Portrait Session"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price ($)</label>
                <input
                  type="number"
                  value={currentPackage.price}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, price: e.target.value })}
                  placeholder="e.g. 500"
                  required
                  min="0"
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</label>
                <input
                  type="text"
                  value={currentPackage.duration}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, duration: e.target.value })}
                  placeholder="e.g. 4 Hours"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deliverables</label>
                <input
                  type="text"
                  value={currentPackage.deliverables}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, deliverables: e.target.value })}
                  placeholder="e.g. 100 Edited Photos, Print Release"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-md"
              >
                <Save className="w-5 h-5" />
                Save Package
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-300">No Packages Yet</h3>
              <p className="text-slate-500 text-sm mt-1">Create your first package to start attracting clients.</p>
            </div>
          ) : (
            packages.map(pkg => (
              <div key={pkg.id} className="glass-card p-6 border border-slate-700/60 rounded-3xl hover:border-amber-500/30 transition-colors relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(pkg)} className="p-2 bg-slate-800 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
                <div className="text-3xl font-extrabold text-amber-400 font-serif mb-6">${pkg.price}</div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Duration: {pkg.duration}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Includes: {pkg.deliverables}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
