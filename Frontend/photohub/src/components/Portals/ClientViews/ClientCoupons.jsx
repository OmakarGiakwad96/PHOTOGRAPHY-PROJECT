import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Copy, Check } from 'lucide-react';

export const ClientCoupons = () => {
  const { t } = useTranslation();

  const coupons = [
    { code: 'WELCOME10', desc: '10% off your first booking', validUntil: 'Dec 31, 2026', minSpend: '₹10,000' },
    { code: 'FESTIVE500', desc: 'Flat ₹500 off on Wedding Photography', validUntil: 'Oct 31, 2026', minSpend: '₹25,000' },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('clientCoupons.myCoupons')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('clientCoupons.specialDiscountCod')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((c, i) => (
          <div key={i} className="flex bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden group">
            {/* Left side pattern */}
            <div className="w-12 bg-amber-500 flex flex-col justify-between items-center py-4 border-r border-dashed border-slate-900">
              <div className="w-4 h-4 rounded-full bg-slate-900 -ml-6"></div>
              <span className="text-slate-900 font-bold uppercase tracking-widest text-[10px] -rotate-90 whitespace-nowrap">{t('clientCoupons.discount')}</span>
              <div className="w-4 h-4 rounded-full bg-slate-900 -ml-6"></div>
            </div>
            
            {/* Right side content */}
            <div className="flex-1 p-6 relative bg-slate-950">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/20 transition-colors"></div>
              <Tag className="w-5 h-5 text-amber-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">{c.desc}</h3>
              <p className="text-xs text-slate-500 mb-6">{t('clientCoupons.minSpendCMinSp')}</p>
              
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="font-mono text-amber-400 font-bold px-3 tracking-wider">{c.code}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(c.code);
                    alert(`Copied ${c.code} to clipboard!`);
                  }}
                  className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
