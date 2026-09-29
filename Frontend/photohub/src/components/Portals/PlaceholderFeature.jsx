import React from 'react';
import { Sparkles } from 'lucide-react';

export const PlaceholderFeature = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
        <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
      </div>
      <h2 className="text-3xl font-extrabold text-white mb-4">{title}</h2>
      <p className="text-slate-400 max-w-md mx-auto text-sm">
        This premium feature is currently under active development. Check back soon for exciting updates to your dashboard!
      </p>
    </div>
  );
};
