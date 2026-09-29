import React, { useState } from 'react';
import { Camera, LogIn, UserPlus, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export const AuthPage = () => {
  const { loginUser, registerUser, switchUserRole, navigateToTab, activeTabParams, isAuthenticated } = useApp();
  const { t } = useTranslation();
  
  // Use param to determine default mode if needed
  const [mode, setMode] = useState(activeTabParams?.mode || 'login');
  
  // Protect the Auth page from already authenticated users
  React.useEffect(() => {
    if (isAuthenticated) {
      navigateToTab('dashboard');
    }
  }, [isAuthenticated, navigateToTab]);
  
  React.useEffect(() => {
    if (activeTabParams?.mode) {
      setMode(activeTabParams.mode);
    }
    if (activeTabParams?.role) {
      setRole(activeTabParams.role);
    }
  }, [activeTabParams]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(activeTabParams?.role || 'client');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setError('');
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError('');
    
    // Password Validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters and include a letter, number, and special character (e.g., rakesh@123)');
      return;
    }

    setLoading(true);

    await new Promise(r => setTimeout(r, 600));

    if (mode === 'login') {
      const result = await loginUser(email, password);
      if (!result.success) {
        setError(result.message);
      } else {
        toast.success(`Welcome back, ${result.user.name}!`);
      }
    } else {
      const result = await registerUser(name, email, password, phone, role);
      if (!result.success) {
        setError(result.message);
      } else {
        toast.success(t('authPage.accountCreatedSucc'));
      }
    }
    setLoading(false);
  };

  const DEMO_ACCOUNTS = [
    { role: 'client', label: '🧑 Client Demo', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20' },
    { role: 'photographer', label: '📷 Photographer Demo', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20' },
    { role: 'admin', label: '🛡 Admin Demo', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] flex">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 relative z-10 bg-[#0b0e14]">
        
        <button 
          onClick={() => navigateToTab('home')}
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('auth.backToHome')}
        </button>

        <div className="max-w-md w-full mx-auto space-y-8 mt-12">
          {/* Header */}
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white font-serif">
                {mode === 'login' ? t('auth.welcomeBack') : t('auth.joinPhotoHub')}
              </h2>
              <p className="text-sm text-slate-400 font-light mt-1">{t('auth.subtitle')}</p>
            </div>
          </div>


          {/* Role Selection for Login */}
          {mode === 'login' && (
            <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Role</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleRoleChange('client')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-2 ${role === 'client' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 'text-slate-400 border-slate-700/60 bg-slate-900 hover:bg-slate-800'}`}
                >
                  🧑 {t('auth.client')}
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('photographer')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-2 ${role === 'photographer' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-400 border-slate-700/60 bg-slate-900 hover:bg-slate-800'}`}
                >
                  📷 {t('auth.photographer')}
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-2 ${role === 'admin' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' : 'text-slate-400 border-slate-700/60 bg-slate-900 hover:bg-slate-800'}`}
                >
                  🛡 {t('authPage.Admin', 'Admin')}
                </button>
              </div>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {mode === 'register' && (
              <div className="space-y-5 animate-fade-in">
                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('client')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      role === 'client' 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                        : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <UserPlus className="w-6 h-6" />
                    <span className="text-xs font-bold">{t('auth.iAmClient')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('photographer')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      role === 'photographer' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                        : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-xs font-bold">{t('auth.iAmPhotographer')}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('auth.fullName')}</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                    placeholder={t('auth.enterName')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('auth.phone')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    placeholder={t('auth.enterPhone')}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700/60 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('auth.email')}</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                placeholder="Enter your email"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700/60 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('auth.password')}</label>
              <div className="relative">
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                  minLength={8}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-900 border border-slate-700/60 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-black font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                loading ? 'bg-amber-600 cursor-wait' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]'
              }`}
            >
              {mode === 'login' ? (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{t('authPage.login')}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>{t('auth.createAccountBtn')}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center text-sm text-slate-400 pt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setEmail(''); setPassword(''); setName(''); setPhone(''); }}
              className="text-amber-400 font-bold hover:underline ml-1"
            >
              {mode === 'login' ? t('auth.newToPhotoHub') : t('auth.alreadyHaveAccount')}
            </button>
          </p>
        </div>
      </div>

      {/* Right Column: Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 border-l border-slate-800">
        <img 
          src="https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg" 
          alt={t('authPage.premiumWeddingPhot')} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent" />
        
        <div className="absolute bottom-16 left-16 max-w-lg space-y-4">
          <div className="p-4 glass-card border-amber-500/20 bg-black/40 backdrop-blur-md">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">{t('authPage.captureEveryMoment')}</h3>
            <p className="text-slate-300 font-light leading-relaxed">
              {t('authPage.joinThousandsOfCl')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
