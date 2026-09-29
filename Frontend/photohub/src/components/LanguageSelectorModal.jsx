import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { getRecommendedLanguage, SUPPORTED_LANGUAGES } from '../utils/languageRecommendations';

export const LanguageSelectorModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const { i18n } = useTranslation();
  const { searchParams } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!isOpen || !mounted) return null;

  const currentLang = i18n.language || 'en';
  const recommendedLangCode = getRecommendedLanguage(searchParams?.city);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl shadow-black overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <Globe className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">{t('languageSelectorModal.selectLanguage')}</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {recommendedLangCode && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Recommended for {searchParams.city}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SUPPORTED_LANGUAGES.filter(lang => lang.code === recommendedLangCode).map(lang => (
                        <LanguageCard 
                          key={`rec-${lang.code}`}
                          lang={lang} 
                          isSelected={currentLang === lang.code} 
                          onClick={() => changeLanguage(lang.code)} 
                          isRecommended={true}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{t('languageSelectorModal.allLanguages')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <LanguageCard 
                        key={lang.code}
                        lang={lang} 
                        isSelected={currentLang === lang.code} 
                        onClick={() => changeLanguage(lang.code)} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

const LanguageCard = ({ lang, isSelected, onClick, isRecommended }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between p-4 rounded-xl border text-left transition duration-300
        ${isSelected 
          ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
        }
      `}
    >
      <div className="flex flex-col">
        <span className={`text-lg font-bold ${isSelected ? 'text-amber-500' : 'text-white'}`}>
          {lang.nativeName}
        </span>
        <span className="text-sm text-slate-400">{lang.enName}</span>
      </div>
      
      {isSelected && (
        <CheckCircle className="w-5 h-5 text-amber-500" />
      )}
      
      {!isSelected && isRecommended && (
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
{t('languageSelectorModal.recommended')}
</span>
      )}
    </button>
  );
};
