import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, CreditCard, ShieldCheck, CheckCircle2, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const BookingModal = () => {
  const {
    activeBookingModal,
    setActiveBookingModal,
    photographers,
    packages,
    createBooking,
    currentUser,
    setAuthModal
  } = useApp();
  const { t } = useTranslation();

  const [step, setStep] = useState(3);
  const [selectedPhotographerId, setSelectedPhotographerId] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [bookingDate, setBookingDate] = useState('2025-09-15');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [location, setLocation] = useState('Central Park Conservancy, NYC');
  const [specialReqs, setSpecialReqs] = useState('Drone aerial shots and sunset natural light studio look.');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (activeBookingModal?.photographer_id) {
      setSelectedPhotographerId(activeBookingModal.photographer_id);
    } else if (photographers.length > 0) {
      setSelectedPhotographerId(photographers[0].photographer_id);
    }

    if (activeBookingModal?.package_id) {
      setSelectedPackageId(activeBookingModal.package_id);
    } else if (packages.length > 0) {
      setSelectedPackageId(packages[0].package_id);
    }

    if (activeBookingModal?.open) {
      setStep(3); // Force payment interface immediately
    }
  }, [activeBookingModal, photographers, packages]);

  if (!activeBookingModal?.open) return null;

  const currentPhotographer = photographers.find(p => p.photographer_id === Number(selectedPhotographerId)) || photographers[0];
  const currentPackage = packages.find(pkg => pkg.package_id === Number(selectedPackageId)) || packages[0];

  const handleNextStep = () => {
    if (!currentUser) {
      setActiveBookingModal({ ...activeBookingModal, open: false });
      setAuthModal({ open: true, mode: 'login', redirectTab: 'home', actionPayload: activeBookingModal });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsOtpStage(true);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert(t('checkout.invalidOtp') || 'Please enter a valid 6-digit OTP.');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const bookingPayload = {
      photographer_id: currentPhotographer.photographer_id,
      package_id: currentPackage.package_id,
      booking_date: bookingDate,
      booking_time: bookingTime,
      location: location,
      special_requirements: specialReqs,
      total_price: currentPackage.price
    };

    const res = await createBooking(bookingPayload, paymentMethod);
    setIsProcessing(false);
    setBookingSuccess(res);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto text-left animate-fade-in">
      <div className="relative max-w-2xl w-full bg-[#0b0e14] rounded-[2rem] border border-slate-700/60 shadow-2xl shadow-black/80 overflow-hidden my-8 p-6 sm:p-10 space-y-8 animate-slide-up">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white font-serif">{t('booking.secureBooking')}</h2>
              <p className="text-sm text-slate-400 font-light">{t('booking.completeDetails')}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveBookingModal({ open: false });
              setBookingSuccess(null);
              setStep(3);
              setIsOtpStage(false);
              setOtp('');
            }}
            className="p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md text-slate-400 hover:text-white border border-slate-700/80 transition-colors hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>





        {/* STEP 3: Payment Gateway Simulation */}
        {step === 3 && !bookingSuccess && (
          <div className="space-y-6 animate-fade-in">
            {/* Booking Summary Box */}
            <div className="glass-card p-6 border border-slate-700/60 space-y-3">
              <div className="flex justify-between items-end border-b border-slate-800 pb-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('bookingModal.selectedPackage')}</p>
                  <span className="text-lg font-bold text-white font-serif">{currentPackage?.name}</span>
                </div>
                <span className="text-2xl font-extrabold text-amber-400 font-serif">₹{currentPackage?.price}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-0.5">{t('bookingModal.professional')}</p>
                  <p className="text-slate-200">{currentPhotographer?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-0.5">{t('bookingModal.dateTime')}</p>
                  <p className="text-slate-200">{bookingDate} at {bookingTime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-0.5">{t('bookingModal.venue')}</p>
                  <p className="text-slate-200">{location}</p>
                </div>
              </div>
            </div>

            {!isOtpStage ? (
              <form onSubmit={handleInitiatePayment} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('booking.payment')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Credit Card', 'Debit Card', 'UPI'].map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                          paymentMethod === method
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-inner'
                            : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {method !== 'UPI' && <CreditCard className="w-5 h-5" />}
                        <span>{method}</span>
                      </button>
                    ))}
                  </div>
                  
                  {paymentMethod === 'UPI' && (
                    <div className="mt-4 space-y-2 animate-fade-in pt-2 border-t border-slate-800">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">UPI ID / VPA</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. username@upi"
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-amber-500/60 transition-colors"
                      />
                    </div>
                  )}

                  {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                    <div className="mt-4 space-y-4 animate-fade-in pt-2 border-t border-slate-800">
                      <input type="text" required maxLength="50" placeholder="Enter Account Holder Name" className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/60" />
                      <input type="text" required inputMode="numeric" maxLength="11" placeholder="Enter 11-digit Account Number" className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/60" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" required inputMode="numeric" maxLength="5" placeholder="Expiry (MM/YY)" className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/60" />
                        <input type="text" required inputMode="numeric" maxLength="3" placeholder="3-digit CVV" className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/60" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400/90 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('bookingModal.100SecureTransact')}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-amber hover-shine w-full py-4 flex items-center justify-center disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : t('bookingModal.payCurrentPackage')}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in border-t border-slate-800 pt-6">
                <h3 className="text-xl font-bold text-white text-center">OTP Verification</h3>
                <div className="space-y-4 text-center">
                  <p className="text-slate-300">
                    We have sent a 6-digit OTP to your registered mobile number: 
                    <span className="font-bold text-white ml-2">{currentUser?.phone ? `******${currentUser.phone.slice(-4)}` : '******9994'}</span>
                  </p>
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    maxLength="6" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP" 
                    className="w-full max-w-xs mx-auto text-center tracking-widest text-2xl font-bold bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500/60 block" 
                  />
                  <p className="text-sm text-slate-500 mt-2">Didn't receive the code? <button type="button" className="text-amber-500 hover:underline">Resend OTP</button></p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOtpStage(false)}
                    disabled={isProcessing}
                    className="w-1/3 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-bold border border-slate-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isProcessing || otp.length !== 6}
                    className={`w-2/3 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
                      isProcessing || otp.length !== 6 ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02]'
                    }`}
                  >
                    {isProcessing ? 'Verifying...' : 'Verify & Pay'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STEP 4: Success & Confirmation */}
        {bookingSuccess && (
          <div className="py-8 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-extrabold text-white font-serif">{t('booking.success')}</h3>
              <p className="text-sm text-slate-400 font-light">
                {t('booking.successDesc')}
              </p>
            </div>

            <div className="glass-card p-6 border border-slate-700/60 text-left text-sm space-y-3 max-w-sm mx-auto">
              <div className="flex justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">{t('bookingModal.transactionID')}</span>
                <span className="font-mono text-amber-400">{bookingSuccess.payment?.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('bookingModal.bookingID')}</span>
                <span className="font-medium text-white">#{bookingSuccess.booking?.booking_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('bookingModal.amountPaid')}</span>
                <span className="font-bold text-emerald-400">₹{bookingSuccess.payment?.amount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveBookingModal({ open: false });
                setBookingSuccess(null);
                setStep(3);
                setIsOtpStage(false);
                setOtp('');
              }}
              className="btn-amber px-10 py-3.5 mt-4"
            >
              {t('bookingModal.backToDashboard')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
