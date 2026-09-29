import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Key, Eye, EyeOff, Loader, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLogin = () => {
  const { t } = useTranslation();

  const { loginUser, navigateToTab, isAuthenticated } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Protect from already authenticated users
  React.useEffect(() => {
    if (isAuthenticated) {
      navigateToTab('dashboard');
    }
  }, [isAuthenticated, navigateToTab]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError('');

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters and include a letter, number, and special character (e.g., rakesh@123)');
      return;
    }

    if (email !== 'rocky123@gmail.com' || password !== 'rocky@123') {
      setError('Secure access denied. Invalid admin credentials.');
      return;
    }

    setLoading(true);

    await new Promise(r => setTimeout(r, 800)); // Simulate secure handshake

    const result = await loginUser(email, password);
    if (!result.success) {
      setError('Secure access denied. Invalid admin credentials.');
    } else {
      if (result.user.role !== 'admin') {
        setError('Unauthorized role. Access denied.');
        // In a real app we'd logout the user here if they try to access admin portal
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#06080b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Secure Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0b0e14]/90 backdrop-blur-2xl border border-amber-500/20 rounded-[32px] p-8 md:p-10 shadow-2xl shadow-amber-500/10">
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-2xl"></div>
              <ShieldAlert className="w-8 h-8 text-amber-500 relative z-10" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">{t('adminLogin.systemAdmin')}</h1>
            <p className="text-slate-400 text-sm">{t('adminLogin.authorizedPersonnel')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl flex items-center justify-center font-semibold text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('adminLogin.adminEmail')}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#06080b] border border-slate-700/50 rounded-xl px-12 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium"
                    placeholder="Enter the email"
                    spellCheck="false"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t('adminLogin.securePassword')}</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-[#06080b] border border-slate-700/50 rounded-xl px-12 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium font-mono"
                    placeholder="Enter the password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {t('adminLogin.authenticating')}
                </>
              ) : (
                t('adminLogin.key5070')
              )}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};
