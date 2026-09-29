import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MessageSquare } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const PhotoReviews = () => {
  const { t } = useTranslation();

  const { currentUser } = useApp();

  // Mock reviews
  const reviews = [
    { id: 1, author: 'Aman S.', rating: 5, date: '2 days ago', text: 'Amazing experience! The photos came out beautifully, and the entire process was so professional.', reply: null },
    { id: 2, author: 'Priya M.', rating: 4, date: '1 week ago', text: 'Great shots, but delivery took a day longer than expected. Still highly recommend!', reply: 'Hi Priya, thanks for the feedback! We had a slight delay with editing but I am glad you loved the photos.' },
    { id: 3, author: 'Rahul K.', rating: 5, date: '2 weeks ago', text: 'Best photographer I have ever hired. Made us feel so comfortable.', reply: null }
  ];

  const averageRating = 4.8;
  const totalReviews = 142;

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoReviews.reviews')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoReviews.seeWhatClientsAre')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-8 border border-slate-700/60 rounded-3xl text-center md:col-span-1">
          <h3 className="text-6xl font-black text-white font-serif mb-2">{averageRating}</h3>
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
            ))}
          </div>
          <p className="text-sm text-slate-400">{t('photoReviews.basedOnTotalRevie')}</p>
        </div>
        
        <div className="glass-card p-6 border border-slate-700/60 rounded-3xl md:col-span-2 flex flex-col justify-center space-y-3">
          {[5, 4, 3, 2, 1].map(star => {
            const count = star === 5 ? 120 : star === 4 ? 18 : star === 3 ? 3 : star === 2 ? 1 : 0;
            const percent = (count / totalReviews) * 100;
            return (
              <div key={star} className="flex items-center gap-4">
                <span className="text-sm text-slate-400 w-12 text-right">{star} Star</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
                <span className="text-sm text-slate-500 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review, idx) => (
          <div key={review.id} className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-white text-lg">{review.author}</h4>
                <p className="text-xs text-slate-500">{review.date}</p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                ))}
              </div>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-6">{review.text}</p>
            
            {review.reply ? (
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 ml-6 relative">
                <div className="absolute -left-3 top-4 w-3 h-px bg-slate-700"></div>
                <div className="absolute -left-3 top-0 w-px h-4 bg-slate-700"></div>
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">{t('photoReviews.yourReply')}</h5>
                <p className="text-sm text-slate-400 italic">{review.reply}</p>
              </div>
            ) : (
              <button className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                <MessageSquare className="w-4 h-4" /> Reply to Review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
