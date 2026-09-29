import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Download, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ClientDeliveryPortal = ({ bookingId, token }) => {
  const { t } = useTranslation();
  const [gallery, setGallery] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaid, setIsPaid] = useState(true);
  const [galleryUnlocked, setGalleryUnlocked] = useState(true);

  // Use dummy gallery if fetch fails
  useEffect(() => {
    setGallery([
      { photoId: '1', lowResWatermarkedUrl: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg" },
      { photoId: '2', lowResWatermarkedUrl: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg" },
      { photoId: '3', lowResWatermarkedUrl: "https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg" },
    ]);
  }, [bookingId]);

  const toggleSelection = (photoId) => {
    setSelectedIds(prev => {
      if (prev.includes(photoId)) return prev.filter(id => id !== photoId);
      if (prev.length >= 100) return prev;
      return [...prev, photoId];
    });
  };

  const submitSelection = async () => {

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(t('portal.success'));
    }, 1000);
  };

  const progressPercentage = (selectedIds.length / 100) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
      <div className="p-8 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#E91E63]" />
            {t('portal.title')}
          </h2>
          <p className="text-gray-500 mt-1">{t('portal.desc')}</p>
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-700">{selectedIds.length} / 100 {t('portal.selected')}</p>
              <p className="text-xs text-gray-500">{t('portal.forAlbum')}</p>
            </div>
            <button onClick={submitSelection} disabled={isSubmitting || selectedIds.length === 0} className="bg-[#E91E63] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#D81B60] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md shadow-pink-500/20">
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? t('portal.submitting') : t('portal.submitSelection')}
            </button>
          </div>
          <div className="w-full md:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#E91E63] transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
      </div>

      <div className={`p-4 flex items-center justify-between border-b ${isPaid && galleryUnlocked ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
        <div className="flex items-center gap-3">
          {isPaid && galleryUnlocked ? <Download className="w-5 h-5 text-green-600" /> : <Lock className="w-5 h-5 text-orange-600" />}
          <div>
            <p className={`font-semibold ${isPaid && galleryUnlocked ? 'text-green-800' : 'text-orange-800'}`}>{t('portal.highRes')}</p>
            <p className={`text-xs ${isPaid && galleryUnlocked ? 'text-green-600' : 'text-orange-600'}`}>{isPaid && galleryUnlocked ? t('portal.unlocked') : t('portal.locked')}</p>
          </div>
        </div>
        <button disabled={!isPaid || !galleryUnlocked} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPaid && galleryUnlocked ? 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
          {t('portal.downloadAll')}
        </button>
      </div>

      <div className="p-8 bg-gray-50/30">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map(photo => {
            const isSelected = selectedIds.includes(photo.photoId);
            return (
              <div key={photo.photoId} onClick={() => toggleSelection(photo.photoId)} className={`relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer group transition-all ${isSelected ? 'ring-4 ring-[#E91E63] ring-offset-2' : 'hover:opacity-90'}`}>
                <img src={photo.lowResWatermarkedUrl} alt={t('clientDeliveryPortal.proof')} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-medium bg-black/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm">{isSelected ? t('portal.deselect') : t('portal.select')}</p>
                </div>
                {isSelected && <div className="absolute top-3 right-3 bg-[#E91E63] text-white p-1 rounded-full shadow-lg"><CheckCircle className="w-5 h-5" /></div>}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 mix-blend-overlay"><span className="text-3xl font-black text-white transform -rotate-45 tracking-widest uppercase">{t('portal.proof')}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientDeliveryPortal;
