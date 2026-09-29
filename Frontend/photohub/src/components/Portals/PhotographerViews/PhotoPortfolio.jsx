import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Image, Upload, Trash2, X, Plus, Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const PhotoPortfolio = () => {
  const { portfolio, setPortfolio, currentUser } = useApp();
  const [myPhotos, setMyPhotos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Categories typically used
  const categories = ['All', 'Wedding', 'Portrait', 'Commercial', 'Event', 'Fashion', 'Maternity'];

  useEffect(() => {
    if (currentUser) {
      // Find all photos uploaded by this photographer (using user_id to match photographer_id for mock)
      // Note: In real app, currentUser.user_id matches photographer_id via relationship.
      const photos = portfolio.filter(p => p.photographer_id === (currentUser.user_id + 100) || p.photographer_id === currentUser.user_id || p.photographer_id === 101);
      
      if (filter !== 'All') {
        setMyPhotos(photos.filter(p => p.category === filter));
      } else {
        setMyPhotos(photos);
      }
    }
  }, [portfolio, currentUser, filter]);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newPhoto = {
        portfolio_id: Date.now(),
        photographer_id: currentUser.user_id === 2 ? 101 : currentUser.user_id + 100, // mock ID logic
        image_url: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg',
        title: 'New Portfolio Image',
        category: filter !== 'All' ? filter : 'Wedding',
        upload_date: new Date().toISOString().substring(0, 10),
        views: 0,
        likes: 0
      };
      
      setPortfolio([newPhoto, ...portfolio]);
      setIsUploading(false);
      toast.success('Photo uploaded successfully to your portfolio!');
    }, 1500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this photo from your portfolio?')) {
      setPortfolio(portfolio.filter(p => p.portfolio_id !== id));
      toast.success('Photo removed');
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full animate-fade-in max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">My Portfolio</h2>
          <p className="text-slate-400 mt-1">Manage your gallery images to showcase your best work</p>
        </div>
        
        <button 
          onClick={handleUpload}
          disabled={isUploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          <span>{isUploading ? 'Uploading...' : 'Upload New Photo'}</span>
        </button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
        
        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
          <Filter className="w-5 h-5 text-slate-500 mr-2 flex-shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20' 
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {myPhotos.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600">
              <Image className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-300">No Photos Found</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                You haven't uploaded any photos to this category yet. Click the upload button to add your first photo!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPhotos.map((photo) => (
              <div 
                key={photo.portfolio_id}
                className="group relative rounded-2xl overflow-hidden bg-slate-800 aspect-[4/3] border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <img 
                  src={photo.image_url} 
                  alt={photo.title || 'Portfolio Image'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onClick={() => setPreviewImage(photo.image_url)}
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2 inline-block">
                        {photo.category}
                      </span>
                      <h4 className="text-white font-bold truncate">{photo.title || 'Untitled Image'}</h4>
                      <p className="text-slate-400 text-xs">Uploaded: {photo.upload_date || 'Recently'}</p>
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(photo.portfolio_id); }}
                      className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            onClick={() => setPreviewImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
