import React, { useState } from 'react';
import { IndianRupee, Lock, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { initiateRazorpayPayment } from '../utils/razorpay';

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
    const newBookingId = Date.now();

    await initiateRazorpayPayment({
      amount: total,
      bookingId: newBookingId,
      userId: currentUser?.user_id || 1,
      photographerId: photographer.photographer_id,
      customerName: currentUser?.name || 'Valued Client',
      customerEmail: currentUser?.email || 'client@photohubconnect.store',
      customerPhone: currentUser?.phone || '9876543210',
      packageName: 'Event Photography Session',
      onSuccess: async (paymentResult) => {
        await createBooking({
          booking_id: newBookingId,
          photographer_id: photographer.photographer_id,
          package_id: 1,
          booking_date: new Date().toISOString().split('T')[0],
          booking_time: '10:00 AM',
          location: 'Pune / Mumbai Venue Default',
          total_price: total
        }, 'Razorpay Secure');

        setIsProcessing(false);
        setSuccess(true);
      },
      onFailure: (err) => {
        setIsProcessing(false);
        alert(typeof err === 'string' ? err : 'Payment was not completed.');
      }
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-12 text-center space-y-6 animate-fade-in border-emerald-500/20">
          <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto" />
          <h1 className="text-3xl font-serif font-bold text-white">{t('checkout.successTitle')}</h1>
          <p className="text-slate-400">{t('checkout.successDesc')}</p>
          <button onClick={() => navigateToTab('photographers')} className="btn-amber w-full py-4 font-bold">
            Browse More Photographers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] py-24 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Payment Options */}
        <div className="space-y-8 animate-slide-right">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-white">{t('checkout.secureCheckout')}</h1>
            <p className="text-slate-400 flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-emerald-400" /> Powered by Razorpay Standard Checkout
            </p>
          </div>

          <div className="glass-card p-8 space-y-6 border border-slate-800">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4">
              Select Payment Method
            </h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                    UPI
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Instant UPI & QR Code</h5>
                    <p className="text-xs text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">Fastest</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-slate-400" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Cards & NetBanking</h5>
                    <p className="text-xs text-slate-400">Visa, Mastercard, RuPay, HDFC, ICICI, SBI</p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">Bank 3D-Secure</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                You will be redirected to the official 256-bit encrypted Razorpay checkout modal. Your card and UPI credentials remain strictly protected.
              </span>
            </div>

            <button 
              onClick={handleInitiatePayment}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-base transition flex items-center justify-center gap-2 ${
                isProcessing ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'btn-amber hover-shine shadow-xl shadow-amber-500/20'
              }`}
            >
              {isProcessing ? 'Opening Razorpay Gateway...' : `Proceed to Pay ₹${total.toLocaleString()}`}
            </button>
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
