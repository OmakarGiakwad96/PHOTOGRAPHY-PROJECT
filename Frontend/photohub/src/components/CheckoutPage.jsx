import React, { useState } from 'react';
import { IndianRupee, Lock, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const CheckoutPage = () => {
  const { activeTabParams, photographers, createBooking, navigateToTab, currentUser } = useApp();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [otp, setOtp] = useState('');

  const pId = activeTabParams?.photographerId;
  const photographer = photographers.find(p => p.photographer_id === pId);

  if (!photographer) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-rose-500">{t('checkout.invalidSession')}</h2>
          <button onClick={() => navigateToTab('photographers')} className="btn-amber px-6 py-2">{t('checkout.returnDirectory')}</button>
        </div>
      </div>
    );
  }

  // Mock Package Data for Checkout
  const packagePrice = photographer.price_per_hour * 6; // Example 6 hour package
  const taxes = packagePrice * 0.18; // 18% GST
  const total = packagePrice + taxes - discountAmount;

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'WELCOME10') {
      setDiscountAmount(packagePrice * 0.10);
    } else {
      alert(t('checkout.invalidCoupon') || 'Invalid Coupon Code. Try WELCOME10');
    }
  };

  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    // Simulate payment gateway checking details and sending OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsOtpStage(true);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      alert(t('checkout.invalidOtp') || 'Please enter a valid 6-digit OTP.');
      return;
    }

    setIsProcessing(true);
    // Simulate payment gateway processing OTP and capturing payment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await createBooking({
      photographer_id: photographer.photographer_id,
      package_id: 1, // dummy
      booking_date: new Date().toISOString().split('T')[0],
      booking_time: '10:00 AM',
      location: 'Checkout Session Default',
      total_price: total
    }, paymentMethod === 'upi' ? 'UPI' : (paymentMethod === 'debit_card' ? 'Debit Card' : 'Credit Card'));

    setIsProcessing(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-12 text-center space-y-6 animate-fade-in border-emerald-500/20">
          <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto" />
          <h1 className="text-3xl font-serif font-bold text-white">{t('checkout.successTitle')}</h1>
          <p className="text-slate-400">{t('checkout.successDesc')}</p>
          <button onClick={() => navigateToTab('dashboard')} className="btn-amber w-full py-4">{t('checkout.goDashboard')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] py-24 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Payment Form */}
        <div className="space-y-8 animate-slide-right">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-white">{t('checkout.secureCheckout')}</h1>
            <p className="text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> {t('checkout.poweredBy')}
            </p>
          </div>

          <div className="glass-card p-8 space-y-6">
            {!isOtpStage ? (
              <>
                <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">{t('checkout.paymentMethod')}</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <label className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition text-center ${paymentMethod === 'upi' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}>
                      <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                      <span className="text-white font-semibold text-sm">UPI</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition text-center ${paymentMethod === 'credit_card' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}>
                      <input type="radio" name="paymentMethod" value="credit_card" checked={paymentMethod === 'credit_card'} onChange={() => setPaymentMethod('credit_card')} className="hidden" />
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      <span className="text-white font-semibold text-sm">Credit Card</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition text-center ${paymentMethod === 'debit_card' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}>
                      <input type="radio" name="paymentMethod" value="debit_card" checked={paymentMethod === 'debit_card'} onChange={() => setPaymentMethod('debit_card')} className="hidden" />
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      <span className="text-white font-semibold text-sm">Debit Card</span>
                    </label>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="space-y-4 animate-fade-in pt-4 border-t border-slate-800">
                      <input type="text" placeholder="Enter UPI ID (e.g., name@upi)" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
                    </div>
                  )}

                  {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                    <div className="space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
                      <input type="text" maxLength="50" placeholder="Enter Account Holder Name" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
                      <input type="text" inputMode="numeric" maxLength="11" placeholder="Enter 11-digit Account Number" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" inputMode="numeric" maxLength="5" placeholder="Enter Expiry Date (MM/YY)" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
                        <input type="text" inputMode="numeric" maxLength="3" placeholder="Enter 3-digit CVV" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
                    isProcessing ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 hover:scale-[1.02]'
                  }`}
                >
                  {isProcessing ? t('checkout.processing') : `${t('checkout.pay')} ₹${total.toLocaleString()}`}
                </button>
              </>
            ) : (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">OTP Verification</h3>
                <div className="space-y-4 py-6 text-center">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-amber-500" />
                  </div>
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
                    className="w-full text-center tracking-widest text-2xl font-bold bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500" 
                  />
                  <p className="text-sm text-slate-500 mt-2">Didn't receive the code? <button className="text-amber-500 hover:underline">Resend OTP</button></p>
                </div>
                <button 
                  onClick={handleVerifyOtp}
                  disabled={isProcessing || otp.length !== 6}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
                    isProcessing || otp.length !== 6 ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02]'
                  }`}
                >
                  {isProcessing ? 'Verifying...' : 'Verify & Pay'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-8 animate-slide-left" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-8 sticky top-24">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4 mb-6">{t('checkout.orderSummary')}</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <img src={photographer.profile_picture} alt={photographer.name} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <p className="text-white font-bold">{photographer.name}</p>
                <p className="text-sm text-slate-400">{t('checkoutPage.premiumEventPackag')}</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-300">
              <div className="flex justify-between">
                <span>{t('checkout.subtotal')} (6 {t('packages.hours')})</span>
                <span>₹{packagePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>{t('checkout.gst')}</span>
                <span>₹{taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-400">
                <span>{t('checkout.discount')}</span>
                <span>- ₹{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xl font-bold text-white">{t('checkout.total')}</span>
                <span className="text-2xl font-black text-amber-400">₹{total.toLocaleString()}</span>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code (e.g., WELCOME10)" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-800/50 rounded-xl flex gap-3 items-start border border-slate-700">
              <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('checkout.terms')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
