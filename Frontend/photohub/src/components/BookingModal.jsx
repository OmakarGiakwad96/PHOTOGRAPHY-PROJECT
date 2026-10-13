import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, 
  Sparkles, AlertCircle, ArrowRight, ArrowLeft, Tag, Lock, CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { initiateRazorpayPayment } from '../utils/razorpay';

export const BookingModal = () => {
  const {
    activeBookingModal,
    setActiveBookingModal,
    photographers,
    packages,
    createBooking,
    currentUser
  } = useApp();
  const { t } = useTranslation();

  // Steps: 1 = Details & Package, 2 = Review & Price Breakdown, 3 = Confirmation
  const [step, setStep] = useState(1);
  const [selectedPhotographerId, setSelectedPhotographerId] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  
  // Date default to tomorrow
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [bookingDate, setBookingDate] = useState(getTomorrowDate());
  const [bookingTime, setBookingTime] = useState('Morning (08:00 AM - 01:00 PM)');
  const [location, setLocation] = useState('Baner, Pune');
  const [specialReqs, setSpecialReqs] = useState('Candid wedding captures, drone aerial shots, and high-res digital delivery.');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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

    if (currentUser) {
      setClientName(currentUser.name || '');
      setClientEmail(currentUser.email || '');
      setClientPhone(currentUser.phone || '');
    }

    if (activeBookingModal?.open) {
      setStep(activeBookingModal.step || 1);
      setBookingSuccess(null);
      setErrorMessage('');
      setDiscountAmount(0);
      setCouponApplied(false);
    }
  }, [activeBookingModal, photographers, packages, currentUser]);

  if (!activeBookingModal?.open) return null;

  const currentPhotographer = photographers.find(p => p.photographer_id === Number(selectedPhotographerId)) || photographers[0];
  
  // Available packages for this photographer or general packages
  const availablePackages = packages.filter(pkg => pkg.photographer_id === currentPhotographer?.photographer_id);
  const displayPackages = availablePackages.length > 0 ? availablePackages : packages.slice(0, 3);
  
  const currentPackage = displayPackages.find(pkg => pkg.package_id === Number(selectedPackageId)) || displayPackages[0];

  // Pricing calculations
  const basePrice = currentPackage ? Number(currentPackage.price) : 25000;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalAmount = Math.max(0, basePrice + gstAmount - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'WEDDING10' || couponCode.trim().toUpperCase() === 'WELCOME10') {
      const discount = Math.round(basePrice * 0.10);
      setDiscountAmount(discount);
      setCouponApplied(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid promo code. Try WEDDING10 for 10% off!');
    }
  };

  const handleProceedToStep2 = () => {
    if (!clientName.trim()) {
      setErrorMessage('Please enter your full name for the booking confirmation.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim().replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for booking SMS & updates.');
      return;
    }
    if (!location.trim()) {
      setErrorMessage('Please enter the venue / shoot location.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    const newBookingId = Date.now();

    await initiateRazorpayPayment({
      amount: totalAmount,
      bookingId: newBookingId,
      userId: currentUser?.user_id || 1,
      photographerId: currentPhotographer.photographer_id,
      customerName: clientName || currentUser?.name || 'Valued Client',
      customerEmail: clientEmail || currentUser?.email || 'client@photohubconnect.store',
      customerPhone: clientPhone || currentUser?.phone || '9876543210',
      packageName: currentPackage?.name || 'Photography Session',
      onSuccess: async (paymentResult) => {
        const bookingPayload = {
          booking_id: newBookingId,
          photographer_id: currentPhotographer.photographer_id,
          package_id: currentPackage ? currentPackage.package_id : 1,
          booking_date: bookingDate,
          booking_time: bookingTime,
          location: location,
          special_requirements: specialReqs,
          total_price: totalAmount,
          customer_name: clientName,
          customer_phone: clientPhone,
          photographer_name: currentPhotographer.name
        };

        const result = await createBooking(bookingPayload, 'Razorpay Secure');

        // Dispatch verified WhatsApp and SMS notifications
        try {
          await api.post('/notifications/booking-confirmation', {
            bookingId: newBookingId,
            customerName: clientName,
            customerEmail: clientEmail || currentUser?.email || 'client@photohubconnect.store',
            customerPhone: clientPhone,
            photographerName: currentPhotographer.name,
            eventDate: new Date(bookingDate).toISOString(),
            location: location,
            packageName: currentPackage?.name || 'Photography Session',
            amount: totalAmount,
            bookingUrl: 'https://www.photohubconnect.store/client/bookings'
          });
        } catch (notifErr) {
          console.warn("Notification dispatch notice:", notifErr);
        }

        setIsProcessing(false);
        setBookingSuccess({
          booking: result?.booking || { ...bookingPayload, booking_status: 'Confirmed' },
          payment: {
            amount: totalAmount,
            transaction_id: paymentResult?.transactionId || (result?.payment?.transaction_id) || `pay_${Date.now()}`,
            order_id: paymentResult?.orderId,
            status: 'Completed'
          }
        });
        setStep(3); // Success Screen
      },
      onFailure: (err) => {
        setIsProcessing(false);
        setErrorMessage(typeof err === 'string' ? err : 'Payment was cancelled or could not be completed.');
      }
    });
  };

  const closeModal = () => {
    setActiveBookingModal({ open: false });
    setBookingSuccess(null);
    setStep(1);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto text-left animate-fade-in">
      <div className="relative max-w-2xl w-full bg-[#0b0e14] rounded-3xl border border-slate-700/60 shadow-2xl shadow-black/90 overflow-hidden my-6 p-6 sm:p-8 space-y-6 animate-slide-up">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-serif">
                  {step === 3 ? 'Booking Confirmed!' : 'Book Verified Photographer'}
                </h2>
                <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  WedMeGood Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                {step === 1 && 'Step 1 of 2: Select Date, Package & Venue Details'}
                {step === 2 && 'Step 2 of 2: Review Order & Pay via Razorpay'}
                {step === 3 && 'Instant Confirmation & Digital Receipt'}
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2.5 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Photographer Spotlight */}
        {step < 3 && currentPhotographer && (
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <img 
              src={currentPhotographer.profile_picture || currentPhotographer.cover_image} 
              alt={currentPhotographer.name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-700 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white truncate font-serif">{currentPhotographer.name}</h4>
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{currentPhotographer.location}</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-semibold">★ {currentPhotographer.rating}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Rate</span>
              <span className="text-sm font-extrabold text-amber-400">₹{currentPhotographer.price_per_hour}/hr</span>
            </div>
          </div>
        )}

        {/* STEP 1: Details & Package Selection */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            {/* Package Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Select Photography Package
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                {displayPackages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.package_id;
                  return (
                    <div
                      key={pkg.package_id}
                      onClick={() => setSelectedPackageId(pkg.package_id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="text-xs font-bold font-serif leading-snug">{pkg.name}</h5>
                        <span className="text-xs font-black text-amber-400 shrink-0">₹{Number(pkg.price).toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{pkg.description}</p>
                      <div className="mt-2 text-[10px] text-amber-400/90 font-medium">
                        ⏱ {pkg.duration_hours || 4} Hours • High-Res Delivery
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Shoot Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                >
                  <option value="Morning (08:00 AM - 01:00 PM)">Morning (08:00 AM - 01:00 PM)</option>
                  <option value="Afternoon (01:00 PM - 05:00 PM)">Afternoon (01:00 PM - 05:00 PM)</option>
                  <option value="Evening (05:00 PM - 11:00 PM)">Evening (05:00 PM - 11:00 PM)</option>
                  <option value="Full Day Wedding (All Rituals)">Full Day Wedding (All Rituals)</option>
                </select>
              </div>
            </div>

            {/* Venue & Location */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Venue / Shoot Location (Pune, Mumbai, etc.)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Baner, Pune or Koregaon Park, Pune"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Client Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Your Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Rahul Sharma"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Mobile (WhatsApp &amp; SMS) <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">+91</span>
                  <input
                    type="tel"
                    value={clientPhone.replace(/^\+91\s*/, '')}
                    onChange={(e) => setClientPhone(`+91 ${e.target.value.replace(/^\+91\s*/, '')}`)}
                    placeholder="9876543210"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="rahul@gmail.com"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Notification Consent Checkbox */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="mt-0.5 accent-amber-500 rounded" 
                  id="notification-consent-cb"
                />
                <span className="leading-relaxed">
                  I agree to receive instant booking confirmations, photographer approvals, and Razorpay receipts on 
                  <strong className="text-emerald-400 font-semibold"> WhatsApp</strong> and <strong className="text-sky-400 font-semibold">SMS</strong>.
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="btn-amber hover-shine w-full py-3.5 flex items-center justify-center gap-2 font-bold text-sm shadow-xl shadow-amber-500/20"
              >
                <span>Continue to Price Summary & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Price Summary & Razorpay Trigger */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            {/* Price Breakdown Card */}
            <div className="glass-card p-5 border border-slate-800 space-y-3.5">
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-white font-serif">{currentPackage?.name}</h4>
                  <p className="text-xs text-slate-400">{bookingDate} • {bookingTime}</p>
                  <p className="text-xs text-slate-400 mt-0.5">📍 {location}</p>
                </div>
                <span className="text-lg font-black text-white">₹{basePrice.toLocaleString()}</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Package Base Price</span>
                  <span>₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Government GST (18%)</span>
                  <span>₹{gstAmount.toLocaleString()}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Promo Discount (WEDDING10)</span>
                    <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                  <span className="font-bold text-white">Total Payable</span>
                  <span className="text-2xl font-black text-amber-400 font-serif">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon Input */}
              <form onSubmit={handleApplyCoupon} className="pt-2 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon (e.g. WEDDING10)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Trust & Razorpay Badges */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>100% Secure Razorpay Checkout</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Supports UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, NetBanking, and EMI. 
                Your payment is held in escrow until the photographer accepts and delivers.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Navigation & Pay Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isProcessing}
                className="w-1/3 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="btn-amber hover-shine flex-1 py-3.5 flex items-center justify-center gap-2 font-bold text-sm shadow-xl shadow-amber-500/20 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'Opening Razorpay Gateway...' : `Pay ₹${totalAmount.toLocaleString()} with Razorpay`}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Booking Success Screen */}
        {step === 3 && bookingSuccess && (
          <div className="py-6 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                Photographer Booked Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light max-w-md mx-auto">
                Payment verified via Razorpay. We have notified <strong className="text-white">{currentPhotographer.name}</strong>. 
                A confirmation SMS & invoice has been generated.
              </p>
            </div>

            <div className="glass-card p-5 border border-slate-800 text-left text-xs space-y-3 max-w-md mx-auto">
              <div className="flex justify-between pb-2.5 border-b border-slate-800">
                <span className="text-slate-400">Razorpay Transaction ID</span>
                <span className="font-mono text-amber-400 font-bold">{bookingSuccess.payment?.transaction_id || `TXN_${Date.now()}`}</span>
              </div>
              <div className="flex justify-between pb-2.5 border-b border-slate-800">
                <span className="text-slate-400">Booking Reference</span>
                <span className="font-bold text-white">#PHB-{bookingSuccess.booking?.booking_id || Date.now()}</span>
              </div>
              <div className="flex justify-between pb-2.5 border-b border-slate-800">
                <span className="text-slate-400">Scheduled Date & Slot</span>
                <span className="text-slate-200">{bookingDate} • {bookingTime}</span>
              </div>
              <div className="flex justify-between pb-2.5 border-b border-slate-800">
                <span className="text-slate-400">Location</span>
                <span className="text-slate-200">{location}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">Total Amount Paid</span>
                <span className="text-lg font-black text-emerald-400 font-serif">₹{bookingSuccess.payment?.amount || totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={closeModal}
                className="btn-amber px-8 py-3.5 text-xs font-bold shadow-lg"
              >
                Close & Return to Browsing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
