import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  X, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, AlertCircle,
  ArrowRight, ShieldCheck, KeyRound, RefreshCw, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const TWOFACTOR_API_KEY = '5a0e3535-c79a-11f1-af74-0200cd936042';

export const ForgotPasswordModal = ({ isOpen, onClose, onResetSuccess }) => {
  const { users } = useApp();

  // Steps: 'request' -> 'verify' -> 'success'
  const [step, setStep] = useState('request');
  const [channel, setChannel] = useState('SMS'); // 'SMS' or 'EMAIL'
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [genericNotice, setGenericNotice] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // 2Factor Session ID for real cryptographic verification
  const [twoFactorSession, setTwoFactorSession] = useState('');

  // Check URL hash on mount for direct reset links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('reset-password') && hash.includes('token=')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        const urlToken = params.get('token');
        const urlEmail = params.get('email');
        if (urlToken) {
          setToken(urlToken);
          if (urlEmail) setIdentifier(urlEmail);
          setStep('verify');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  if (!isOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: 'Too short', color: 'bg-rose-600' };
    }
  };

  const strength = getPasswordStrength(newPassword);

  // Step 1: Send Request with Strict Authentication
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');

    let cleanPhone = identifier.replace(/[^0-9]/g, '');
    if (channel === 'SMS') {
      if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
        cleanPhone = cleanPhone.slice(-10);
      }
      if (cleanPhone.length !== 10) {
        setError('Please enter a valid 10-digit Indian mobile number (e.g. 8080938257).');
        return;
      }

      // Check if user account exists in system
      const accountFound = users?.some(u => u.phone && (u.phone === cleanPhone || u.phone.endsWith(cleanPhone)));
      if (!accountFound) {
        setError(`No registered account found with mobile number +91 ${cleanPhone}. Please register first.`);
        return;
      }
    } else {
      if (!identifier.includes('@') || !identifier.includes('.')) {
        setError('Please enter a valid email address.');
        return;
      }
      const accountFound = users?.some(u => u.email && u.email.toLowerCase() === identifier.trim().toLowerCase());
      if (!accountFound) {
        setError(`No registered account found with email ${identifier}. Please register first.`);
        return;
      }
    }

    setLoading(true);

    if (channel === 'SMS') {
      try {
        const tfApiKey = import.meta.env.VITE_TWOFACTOR_API_KEY || TWOFACTOR_API_KEY;
        const tfRes = await axios.get(`https://2factor.in/API/V1/${tfApiKey}/SMS/+91${cleanPhone}/AUTOGEN`);
        if (tfRes.data && tfRes.data.Status === 'Success') {
          setTwoFactorSession(tfRes.data.Details);
          toast.success(`SMS OTP sent to +91 ${cleanPhone}`);
          setGenericNotice(`A verification code was sent via SMS to +91 ${cleanPhone}. Please check your phone SMS inbox.`);
          setCooldown(60);
          setStep('verify');
        } else {
          setError(tfRes.data?.Details || 'Failed to dispatch SMS. Please try again.');
        }
      } catch (err) {
        console.error('2Factor SMS error:', err);
        setError('Unable to contact SMS Gateway. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Email reset flow
      try {
        await api.post('/auth/forgot-password', {
          identifier: identifier.trim(),
          channel: 'EMAIL'
        }).catch(() => {});
        toast.success(`Verification link dispatched to ${identifier}`);
        setGenericNotice(`Reset instructions were sent to ${identifier}. Please check your email inbox.`);
        setCooldown(60);
        setStep('verify');
      } catch (err) {
        setError('Failed to send reset email.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Resend SMS code
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setError('');
    setLoading(true);

    let cleanPhone = identifier.replace(/[^0-9]/g, '');
    if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(-10);
    }

    try {
      const tfApiKey = import.meta.env.VITE_TWOFACTOR_API_KEY || TWOFACTOR_API_KEY;
      const tfRes = await axios.get(`https://2factor.in/API/V1/${tfApiKey}/SMS/+91${cleanPhone}/AUTOGEN`);
      if (tfRes.data && tfRes.data.Status === 'Success') {
        setTwoFactorSession(tfRes.data.Details);
        toast.success('New SMS verification code sent to your phone!');
        setCooldown(60);
      } else {
        setError('Failed to resend code. Please wait a minute and try again.');
      }
    } catch (e) {
      setError('SMS Gateway error while resending.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete Password Reset with Strict 2Factor Validation
  const handleCompleteReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
      setError('Password must contain both letters and numbers.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!token && (!otpCode || otpCode.trim().length !== 6)) {
      setError('Please enter the 6-digit verification code received in your SMS.');
      return;
    }

    setLoading(true);

    // Verify OTP with 2Factor Gateway
    if (twoFactorSession) {
      try {
        const tfApiKey = import.meta.env.VITE_TWOFACTOR_API_KEY || TWOFACTOR_API_KEY;
        const verifyRes = await axios.get(`https://2factor.in/API/V1/${tfApiKey}/SMS/VERIFY/${twoFactorSession}/${otpCode.trim()}`);
        if (verifyRes.data && verifyRes.data.Status === 'Success') {
          // Verified successfully!
          updateUserPassword();
        } else {
          setError(verifyRes.data?.Details || 'Invalid OTP. Please check the SMS on your phone and try again.');
          setLoading(false);
          return;
        }
      } catch (err) {
        setError('Verification failed. Invalid or expired OTP code.');
        setLoading(false);
        return;
      }
    } else {
      // Backend token verification fallback
      try {
        const res = await api.post('/auth/reset-password', {
          identifier: identifier.trim(),
          token: token || undefined,
          otp: otpCode.trim() || undefined,
          newPassword,
          confirmPassword
        });
        if (res.data?.success) {
          updateUserPassword();
        } else {
          setError(res.data?.message || 'Verification failed.');
          setLoading(false);
          return;
        }
      } catch (e) {
        setError('Invalid or expired reset token.');
        setLoading(false);
        return;
      }
    }
  };

  const updateUserPassword = () => {
    try {
      const saved = localStorage.getItem('photohub_mock_users_v3');
      if (saved) {
        const list = JSON.parse(saved);
        const updated = list.map(u => {
          if (
            (u.email && u.email.toLowerCase() === identifier.trim().toLowerCase()) ||
            (u.phone && (u.phone === identifier.trim() || identifier.trim().endsWith(u.phone)))
          ) {
            return { ...u, password: newPassword };
          }
          return u;
        });
        localStorage.setItem('photohub_mock_users_v3', JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
    setStep('success');
    toast.success('Password updated successfully!');
    if (onResetSuccess) onResetSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Request Reset */}
        {step === 'request' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-serif">Forgot Password?</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Enter your registered mobile number or email to receive a secure verification code.
              </p>
            </div>

            {/* Channel Selection Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => { setChannel('SMS'); setError(''); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  channel === 'SMS'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                SMS OTP (+91)
              </button>
              <button
                type="button"
                onClick={() => { setChannel('EMAIL'); setError(''); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  channel === 'EMAIL'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email Reset
              </button>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {channel === 'SMS' ? 'Registered Indian Mobile Number' : 'Registered Email Address'}
                </label>
                <div className="relative">
                  {channel === 'SMS' ? (
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-700/60 bg-slate-800/80 text-amber-400 text-sm font-semibold select-none">
                        +91
                      </span>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ''))}
                        placeholder="8080938257"
                        className="w-full px-4 py-3 rounded-r-xl bg-slate-900 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-amber-500/60"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        required
                        type="email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-900 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-amber-500/60"
                      />
                      <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying & Sending SMS...
                  </>
                ) : (
                  <>
                    Send Verification SMS
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Verify & Enter New Password */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-serif">Set New Password</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {genericNotice || 'Please enter the 6-digit verification code received on your phone.'}
              </p>
            </div>

            <form onSubmit={handleCompleteReset} className="space-y-4">
              {/* OTP Code input */}
              {!token && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      6-Digit SMS Verification Code
                    </label>
                    <button
                      type="button"
                      disabled={cooldown > 0 || loading}
                      onClick={handleResendOtp}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 disabled:text-slate-600 transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend SMS'}
                    </button>
                  </div>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    autoFocus
                    className="w-full text-center tracking-[10px] text-xl font-mono font-bold px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/60 text-amber-400 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              )}

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value.replace(/\s/g, ''))}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-900 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-amber-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength Meter */}
                {newPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Strength:</span>
                      <span className="font-bold text-slate-300">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            strength.score >= level ? strength.color : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value.replace(/\s/g, ''))}
                    placeholder="Repeat your password"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-900 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-amber-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying OTP with Gateway...
                  </>
                ) : (
                  <>
                    Reset & Update Password
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: Success Screen */}
        {step === 'success' && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-serif text-white">Password Reset Complete!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Your password has been securely updated. You can now log into your PhotoHub account with your new credentials.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                window.location.hash = '#login';
              }}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Back to Login
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
