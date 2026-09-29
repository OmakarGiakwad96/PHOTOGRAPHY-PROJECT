import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ImageUpload = ({ onUpload, label = "upload.label" }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {

    if (!file) return;
    
    // Create immediate local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'photograpphy');
      formData.append('cloud_name', 'wcxgdspz');

      const response = await fetch('https://api.cloudinary.com/v1_1/wcxgdspz/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.secure_url) {
        // Pass the live Cloudinary URL to the parent component
        if (onUpload) {
          onUpload(data.secure_url);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      alert(t('upload.failed'));
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e) => {

    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {

    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {

    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = (e) => {

    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onUpload) {
      onUpload(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label === "upload.label" ? t('upload.label') : label}</label>
      
      <div 
        onClick={() => !preview && fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer ${
          isDragging 
            ? 'border-amber-500 bg-amber-500/10' 
            : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-600'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {preview ? (
          <div className="relative w-full h-full group">
            <img 
              src={preview} 
              alt={t('imageUpload.preview')} 
              className={`w-full h-full object-cover ${isUploading ? 'opacity-50 blur-sm' : ''}`}
            />
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white font-medium text-sm">
                <svg className="animate-spin h-8 w-8 mb-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('upload.uploading')}
              </div>
            )}
            {!isUploading && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={removeImage}
                  className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  title={t('upload.removeImage')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <div className="p-4 bg-slate-800 rounded-full mb-3">
              <Upload className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-sm font-medium text-white mb-1">{t('upload.clickToUpload')}</p>
            <p className="text-xs text-slate-500">{t('upload.allowedTypes')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
