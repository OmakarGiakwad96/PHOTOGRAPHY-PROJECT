import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Upload, AlertCircle, CheckCircle } from 'lucide-react';

export const PhotoVerification = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoVerification.accountVerification')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoVerification.getTheVerifiedBad')}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <span className="text-amber-400 font-bold text-sm">{t('photoVerification.actionRequired')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Banner */}
          <div className="glass-card p-6 border border-amber-500/30 bg-amber-500/5 rounded-3xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{t('photoVerification.yourProfileIsCurr')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Verified photographers receive up to <strong className="text-amber-400">{t('photoVerification.3xMoreBookings')}</strong>. 
                Complete the steps below to verify your identity and professional portfolio. Verification usually takes 2-3 business days.
              </p>
            </div>
          </div>

          {/* Verification Steps */}
          <div className="space-y-4">
            
            {/* Step 1: Identity */}
            <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl group transition-all hover:border-amber-500/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold font-serif group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{t('photoVerification.identityVerificatio')}</h3>
                    <p className="text-xs text-slate-500">{t('photoVerification.governmentIssuedID')}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Pending
                </span>
              </div>
              
              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-900/50">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <p className="text-sm text-white font-medium mb-1">{t('photoVerification.clickToUploadDocu')}</p>
                <p className="text-xs text-slate-500">{t('photoVerification.jPGPNGOrPDFMax')}</p>
              </div>
            </div>

            {/* Step 2: Portfolio */}
            <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl group transition-all hover:border-amber-500/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold font-serif group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{t('photoVerification.portfolioLinks')}</h3>
                    <p className="text-xs text-slate-500">{t('photoVerification.linksToYourProfes')}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Completed
                </span>
              </div>
              
              <div className="space-y-3">
                <input 
                  type="text" 
                  defaultValue="https://instagram.com/myphotography"
                  disabled
                  className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-slate-400 text-sm opacity-70"
                />
                <input 
                  type="text" 
                  defaultValue="https://myportfolio.com"
                  disabled
                  className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-slate-400 text-sm opacity-70"
                />
              </div>
            </div>

            {/* Step 3: Business Registration (Optional) */}
            <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl group transition-all hover:border-amber-500/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold font-serif group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Business Registration <span className="text-xs font-normal text-slate-500">{t('photoVerification.Optional')}</span></h3>
                    <p className="text-xs text-slate-500">{t('photoVerification.uploadYourGSTCert')}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Pending
                </span>
              </div>
              
              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-900/50">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <p className="text-sm text-white font-medium mb-1">{t('photoVerification.clickToUploadDocu')}</p>
                <p className="text-xs text-slate-500">{t('photoVerification.jPGPNGOrPDFMax')}</p>
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/20 opacity-50 cursor-not-allowed">
              {t('photoVerification.submitForVerificat')}
            </button>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-slate-700/60 rounded-3xl">
            <h3 className="font-bold text-white mb-4 font-serif text-lg">{t('photoVerification.whyVerify')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{t('photoVerification.verifiedBadge')}</h4>
                  <p className="text-xs text-slate-400 mt-1">{t('photoVerification.getTheCovetedBlue')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{t('photoVerification.higherRanking')}</h4>
                  <p className="text-xs text-slate-400 mt-1">{t('photoVerification.appearHigherInCli')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{t('photoVerification.fasterPayouts')}</h4>
                  <p className="text-xs text-slate-400 mt-1">{t('photoVerification.verifiedAccountsGe')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
