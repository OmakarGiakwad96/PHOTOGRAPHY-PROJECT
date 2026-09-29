import React, { useState } from 'react';
import { X, Star, MapPin, CheckCircle, Calendar, MessageSquare, Briefcase, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const PhotographerDetailModal = () => {
  const { t } = useTranslation();
  const {
    selectedPhotographerModal,
    setSelectedPhotographerModal,
    packages,
    portfolio,
    reviews,
    addReview,
    setActiveBookingModal,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState('packages');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  if (!selectedPhotographerModal) return null;

  const photographer = selectedPhotographerModal;
  const photographerPackages = packages.filter(p => p.photographer_id === photographer.photographer_id);
  const photographerPortfolio = portfolio.filter(p => p.photographer_id === photographer.photographer_id);
  const photographerReviews = reviews.filter(r => r.photographer_id === photographer.photographer_id);

  const handleReviewSubmit = (e) => {

    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(photographer.photographer_id, newRating, newComment);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative max-w-4xl w-full bg-[#0b0e14] rounded-[2rem] border border-slate-700/60 shadow-2xl shadow-black/80 overflow-hidden my-8 text-left animate-slide-up">
        
        {/* Cover Banner */}
        <div className="relative h-64 w-full group">
          <img src={photographer.cover_image} alt={photographer.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/40 to-transparent" />
          
          <button
            onClick={() => setSelectedPhotographerModal(null)}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-950/60 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700/80 z-10 transition-colors hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Bar */}
        <div className="px-8 pb-8 relative -mt-20 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <img
                src={photographer.profile_picture || 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg'} className="w-32 h-32 rounded-2xl border-4 border-[#0b0e14] object-cover shadow-2xl bg-slate-800" alt={photographer.name}
              />
              <div className="space-y-1.5 pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-extrabold text-white font-serif">{photographer.name}</h2>
                  {photographer.is_verified && <CheckCircle className="w-5 h-5 text-blue-400" title={t('detailModal.verifiedPro')} />}
                </div>
                <p className="text-sm text-slate-400 flex items-center gap-2 font-light">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{photographer.location}</span>
                  <span className="text-slate-700">•</span>
                  <span>{photographer.experience} {t('detailModal.yearsExp')}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-2">
              <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-sm flex items-center gap-1.5 shadow-inner">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{photographer.rating} / 5.0</span>
              </div>
              <button
                onClick={() => {
                  const pId = photographer.photographer_id;
                  setSelectedPhotographerModal(null);
                  setActiveBookingModal({ open: true, photographer_id: pId, step: 1 });
                }}
                className="btn-amber px-6 py-2.5 text-sm hover-shine flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('detailModal.bookNow')}</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl font-light">
            {photographer.bio}
          </p>

          <div className="flex flex-wrap gap-2">
            {photographer.specialties?.map((spec, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs font-medium text-slate-300 border border-slate-700/50">
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-8 flex gap-8 text-sm font-bold border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'packages' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{t('detailModal.premiumPackages')} ({photographerPackages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'portfolio' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t('detailModal.portfolio')} ({photographerPortfolio.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'reviews' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('detailModal.reviews')} ({photographerReviews.length})</span>
          </button>
        </div>

        {/* Modal Body Tab Content */}
        <div className="p-8 max-h-[50vh] overflow-y-auto space-y-6 custom-scrollbar">
          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {photographerPackages.map((pkg, idx) => (
                <div key={pkg.package_id} className="glass-card p-6 border border-slate-700/60 space-y-4 hover:border-amber-500/40 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-white font-serif">{pkg.name}</h4>
                      <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mt-1">{pkg.duration_hours} {t('detailModal.hoursCoverage')}</p>
                    </div>
                    <span className="text-xl font-extrabold text-amber-400 font-serif">₹{pkg.price}</span>
                  </div>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">{pkg.description}</p>
                  <button
                    onClick={() => {
                      const pId = photographer.photographer_id;
                      const pkgId = pkg.package_id;
                      setSelectedPhotographerModal(null);
                      setActiveBookingModal({ open: true, photographer_id: pId, package_id: pkgId, step: 1 });
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 text-sm font-bold border border-slate-700 transition-colors"
                  >
                    {t('detailModal.selectPackage')}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photographerPortfolio.map((item, idx) => (
                <div key={item.portfolio_id} className="relative h-48 rounded-2xl overflow-hidden border border-slate-700/60 group animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <img src={item.image_url} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-sm font-bold text-white">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-fade-in">
              {/* Reviews List */}
              <div className="space-y-4">
                {photographerReviews.map(r => (
                  <div key={r.review_id} className="glass-card p-5 border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white">{r.user_name || t('detailModal.verifiedClient')}</p>
                      <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 font-light">{r.comment}</p>
                    <p className="text-xs text-slate-500">{r.created_at}</p>
                  </div>
                ))}
              </div>

              {/* Leave Review Form */}
              <form onSubmit={handleReviewSubmit} className="glass-card p-6 border border-slate-700/60 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">{t('detailModal.leaveReview')}</h4>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-400 font-medium">{t('detailModal.rating')}</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="px-4 py-2 bg-slate-900 border border-slate-700 text-amber-400 text-sm font-bold rounded-xl focus:outline-none focus:border-amber-500"
                  >
                    <option value={5}>{t('detailModal.star5')}</option>
                    <option value={4}>{t('detailModal.star4')}</option>
                    <option value={3}>{t('detailModal.star3')}</option>
                  </select>
                </div>
                <textarea
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('detailModal.shareExp')}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="btn-amber px-6 py-2.5 text-sm"
                >
                  {t('detailModal.postReview')}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
