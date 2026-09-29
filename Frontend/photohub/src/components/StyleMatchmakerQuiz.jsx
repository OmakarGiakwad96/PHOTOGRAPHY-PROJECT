import React, { useState } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StyleMatchmakerQuiz = ({ isOpen, onClose, onComplete }) => {
  const { t } = useTranslation();

  const EVENT_TYPES = [
    { id: 'wedding', label: t('quiz.wedding'), icon: '💍' },
    { id: 'pre-wedding', label: t('quiz.preWedding'), icon: '📸' },
    { id: 'maternity', label: t('quiz.maternity'), icon: '🤰' },
    { id: 'corporate', label: t('quiz.corporate'), icon: '👔' },
  ];

  const AESTHETICS = [
    { id: 'Moody & Cinematic', label: t('quiz.moody'), img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606960/photohub/images/faces/faces-2.jpg' },
    { id: 'Bright & Airy', label: t('quiz.bright'), img: "/images/faces/faces-3.webp" },
    { id: 'Traditional High-Contrast', label: t('quiz.traditional'), img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg' },
    { id: 'Editorial & Fine Art', label: t('quiz.editorial'), img: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606960/photohub/images/faces/faces-2.jpg' },
  ];

  const BUDGET_RANGES = [
    { id: 'economy', label: t('quiz.budget1') },
    { id: 'standard', label: t('quiz.budget2') },
    { id: 'premium', label: t('quiz.budget3') },
    { id: 'luxury', label: t('quiz.budget4') },
  ];
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    eventType: '',
    aestheticStyle: '',
    budget: ''
  });

  if (!isOpen) return null;

  const handleSelect = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {

    if (step < 3) setStep(step + 1);
    else {
      onComplete(selections);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
        <div className="flex justify-between items-center p-6 pb-2">
          <div className="flex space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 w-12 rounded-full transition-colors ${step >= i ? 'bg-[#E91E63]' : 'bg-gray-200'}`} />
            ))}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('quiz.q1Title')}</h2>
              <p className="text-gray-500 mb-8">{t('quiz.q1Desc')}</p>
              
              <div className="grid grid-cols-2 gap-4">
                {EVENT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleSelect('eventType', type.id)}
                    className={`p-6 border-2 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                      selections.eventType === type.id 
                        ? 'border-[#E91E63] bg-pink-50 text-[#E91E63]' 
                        : 'border-gray-200 hover:border-[#E91E63]/50 text-gray-700'
                    }`}
                  >
                    <span className="text-4xl">{type.icon}</span>
                    <span className="font-semibold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('quiz.q2Title')}</h2>
              <p className="text-gray-500 mb-8">{t('quiz.q2Desc')}</p>
              
              <div className="grid grid-cols-2 gap-4">
                {AESTHETICS.map(style => (
                  <button
                    key={style.id}
                    onClick={() => handleSelect('aestheticStyle', style.id)}
                    className={`relative overflow-hidden border-4 rounded-2xl transition-all aspect-video group ${
                      selections.aestheticStyle === style.id ? 'border-[#E91E63]' : 'border-transparent'
                    }`}
                  >
                    <img src={style.img} alt={style.label} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <span className="text-white font-bold text-lg">{style.label}</span>
                    </div>
                    {selections.aestheticStyle === style.id && (
                      <div className="absolute top-3 right-3 bg-[#E91E63] text-white p-1 rounded-full shadow-lg">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('quiz.q3Title')}</h2>
              <p className="text-gray-500 mb-8">{t('quiz.q3Desc')}</p>
              
              <div className="space-y-3">
                {BUDGET_RANGES.map(range => (
                  <button
                    key={range.id}
                    onClick={() => handleSelect('budget', range.id)}
                    className={`w-full p-5 border-2 rounded-xl flex items-center justify-between transition-all ${
                      selections.budget === range.id 
                        ? 'border-[#E91E63] bg-pink-50 text-[#E91E63]' 
                        : 'border-gray-200 hover:border-[#E91E63]/50 text-gray-700'
                    }`}
                  >
                    <span className="font-semibold text-lg">{range.label}</span>
                    {selections.budget === range.id && <Check className="w-6 h-6" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-3xl">
          <button
            onClick={nextStep}
            disabled={
              (step === 1 && !selections.eventType) ||
              (step === 2 && !selections.aestheticStyle) ||
              (step === 3 && !selections.budget)
            }
            className="flex items-center gap-2 bg-[#E91E63] text-white px-8 py-3 rounded-full font-bold hover:bg-[#D81B60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? t('quiz.showMatches') : t('quiz.nextStep')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyleMatchmakerQuiz;
