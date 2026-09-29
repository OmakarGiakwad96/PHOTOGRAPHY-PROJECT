import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, Menu, X, LogOut, LayoutDashboard, ChevronDown, UserCog, Globe,
  Home, CalendarDays, Heart, Clock, Image as ImageIcon, CreditCard, Gift,
  Bell, MessageSquare, MapPin, Star, HelpCircle, Settings, BadgeCheck, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const MenuLink = ({ icon, label, badge, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-amber-400 transition-colors">{icon}</div>
      <span className="text-[13px] font-medium">{label}</span>
    </div>
    {badge && (
      <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-amber-500/20">{badge}</span>
    )}
  </button>
);

const NAV_LINKS = [
  { id: 'home', labelKey: 'navbarNew.home' },
  { id: 'services', labelKey: 'navbarNew.exploreServices' },
  { id: 'photographers', labelKey: 'navbarNew.findPhotographers' },
  { id: 'packages', labelKey: 'navbarNew.packages' },
  { id: 'about', labelKey: 'navbarNew.about' },
  { id: 'contact', labelKey: 'navbarNew.contact' },
];

export const Navbar = () => {
  const {
    isAuthenticated,
    currentUser,
    logoutUser,
    navigateToTab,
    activeTab,
    switchUserRole,
    searchParams,
    setSearchParams,
  } = useApp();

  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const featuresDropdownRef = useRef(null);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  
  const selectedCity = searchParams?.city || 'All';
  const setSelectedCity = (city) => setSearchParams(prev => ({ ...prev, city }));

  const CITIES = [
    'All', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Lucknow', 'Goa'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setCityDropdownOpen(false);
      }
      if (featuresDropdownRef.current && !featuresDropdownRef.current.contains(event.target)) {
        setFeaturesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab) => {
    navigateToTab(tab);
    setMobileMenuOpen(false);
  };

  const roles = [
    {
      key: 'client',
      labelKey: 'navbarNew.clientPortal',
      color: 'text-blue-400',
    },
    {
      key: 'photographer',
      labelKey: 'navbarNew.photographerWorkspace',
      color: 'text-emerald-400',
    },
    {
      key: 'admin',
      labelKey: 'navbarNew.adminPanel',
      color: 'text-amber-400',
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Left Side: Navigation and Logo */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Navigation - Hamburger Dropdown */}
            <div className="hidden lg:block relative" ref={featuresDropdownRef}>
              <button
                onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  featuresDropdownOpen
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={t('navbar.menu')}
              >
                <Menu className="w-6 h-6" />
              </button>

              <AnimatePresence>
                {featuresDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 py-2"
                  >
                    {NAV_LINKS.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => {
                          handleNavClick(link.id);
                          setFeaturesDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${
                          activeTab === link.id
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        {t(link.labelKey)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center group-hover:bg-amber-500/30 transition">
                <Camera className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-extrabold text-xl tracking-tight leading-none">{t('navbar.photoHub')}</p>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">{t('navbarNew.photographyServices')}</p>
              </div>
            </button>
            
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">

            {(!isAuthenticated || !currentUser?.role || currentUser?.role === 'client') && (
              <div className="relative hidden md:block" ref={cityDropdownRef}>
                <button
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white transition focus:outline-none"
                >
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold">{selectedCity === 'All' ? t('directory.allLocations', { defaultValue: 'All Cities' }) : t(`citiesData.${selectedCity}.name`, { defaultValue: selectedCity })}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${cityDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {cityDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right py-2"
                    >
                      <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
{t('navbar.availableCities')}
</div>
                      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent custom-scrollbar">
                        {CITIES.map((city) => (
                          <div
                            key={city}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-slate-400 opacity-60 cursor-default`}
                          >
                            <span>{city === 'All' ? t('directory.allLocations', { defaultValue: 'All Cities' }) : t(`citiesData.${city}.name`, { defaultValue: city })}</span>
                            {selectedCity === city && <CheckCircle className="w-4 h-4 text-amber-500" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
                        
            {/* User Profile */}

            {isAuthenticated && currentUser ? (

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-[20px] bg-slate-800/60 backdrop-blur-md border border-slate-700 hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  aria-expanded={userDropdownOpen}
                >
                  <img
                    src={currentUser.profile_picture}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-600"
                  />
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-white text-xs font-bold max-w-[80px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-[20px] shadow-2xl overflow-hidden z-50 origin-top-right"
                    >
                      {/* User Info Header */}
                      <div className="p-5 bg-gradient-to-b from-slate-800/50 to-transparent border-b border-slate-800/80">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={currentUser.profile_picture}
                              alt={currentUser.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-amber-500 shadow-lg shadow-amber-500/20"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-slate-900">
                              <BadgeCheck className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-white truncate flex items-center gap-2">
                              {currentUser.name}
                            </h4>
                            <p className="text-xs text-slate-400 truncate mb-2">{currentUser.email}</p>
                            

                          </div>
                        </div>
                      </div>

                      {/* Quick Links Scrollable Area */}
                      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent p-2">
                        <div className="grid grid-cols-2 gap-1 mb-2">
                          <MenuLink icon={<Home className="w-4 h-4" />} label="Home" onClick={() => { navigateToTab('home'); setUserDropdownOpen(false); }} />
                          <MenuLink icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" onClick={() => { navigateToTab(`${currentUser.role}/home`); setUserDropdownOpen(false); }} />
                          <MenuLink icon={<CalendarDays className="w-4 h-4" />} label="My Bookings" onClick={() => { navigateToTab(`${currentUser.role}/bookings`); setUserDropdownOpen(false); }} />
                          <MenuLink icon={<Heart className="w-4 h-4" />} label="Wishlist" onClick={() => { navigateToTab(`${currentUser.role}/saved`); setUserDropdownOpen(false); }} />
                        </div>
                        
                        <div className="h-px bg-slate-800/80 my-2 mx-2"></div>
                        
                        <div className="space-y-1 mt-2">
                          <MenuLink icon={<ImageIcon className="w-4 h-4" />} label="My Gallery" onClick={() => { navigateToTab(`${currentUser.role}/albums`); setUserDropdownOpen(false); }} />
                          <MenuLink icon={<CreditCard className="w-4 h-4" />} label="Payments & Invoices" onClick={() => { navigateToTab(`${currentUser.role}/payments`); setUserDropdownOpen(false); }} />
                          <MenuLink icon={<Gift className="w-4 h-4 text-purple-400" />} label="Rewards & Coupons" onClick={() => { navigateToTab(`${currentUser.role}/rewards`); setUserDropdownOpen(false); }} />
                          <MenuLink icon={<Bell className="w-4 h-4" />} label="Notifications" badge="3" onClick={() => { navigateToTab(`${currentUser.role}/notifications`); setUserDropdownOpen(false); }} />
                          <MenuLink icon={<MessageSquare className="w-4 h-4" />} label="Messages" badge="1" onClick={() => { navigateToTab(`${currentUser.role}/messages`); setUserDropdownOpen(false); }} />
                          <MenuLink icon={<MapPin className="w-4 h-4" />} label="Saved Addresses" onClick={() => { navigateToTab(`${currentUser.role}/profile`); setUserDropdownOpen(false); }} />
                        </div>

                        <div className="h-px bg-slate-800/80 my-2 mx-2"></div>

                        <div className="space-y-1 mt-2">
                          <MenuLink icon={<Camera className="w-4 h-4 text-amber-400" />} label="Become a Photographer" onClick={() => { 
                            if (isAuthenticated) {
                              logoutUser();
                            }
                            setTimeout(() => {
                              navigateToTab('login', null, { mode: 'register', role: 'photographer' }); 
                            }, 0);
                            setUserDropdownOpen(false); 
                          }} />
                          <MenuLink icon={<HelpCircle className="w-4 h-4" />} label="Help & Support" onClick={() => { navigateToTab(`${currentUser.role}/support`); setUserDropdownOpen(false); }} />
                          <MenuLink icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => { navigateToTab(`${currentUser.role}/settings`); setUserDropdownOpen(false); }} />
                        </div>
                      </div>

                      {/* Logout Footer */}
                      <div className="p-2 border-t border-slate-800/80 bg-slate-900/50">
                        <button
                          onClick={() => { logoutUser(); setUserDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-4 py-2.5 rounded-[16px] text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold transition-colors group"
                        >
                          <span className="flex items-center gap-3"><LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
{t('navbar.logout')}
</span>
                        </button>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            ) : (

              <div className="hidden sm:flex items-center gap-3">

                <button
                  onClick={() => navigateToTab('login', null, { mode: 'login' })}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition text-sm font-semibold whitespace-nowrap">
                  {t('navbar.login')}
                </button>

                <button 
                  onClick={() => navigateToTab('photographers')} 
                  className="hidden lg:flex items-center justify-center px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 whitespace-nowrap">
                  {t('navbarNew.bookNow')}
                </button>

              </div>

            )}

            {/* Mobile Menu Button */}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white">

              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}

            </button>

          </div>

        </div>

      </div>

      {/* Mobile Navigation */}

      {mobileMenuOpen && (

        <div className="lg:hidden border-t border-slate-800 bg-slate-950">

          <div className="px-4 py-4 space-y-2">

            {NAV_LINKS.map((link) => (

              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === link.id
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}>
                {link.label}
              </button>

            ))}

            {!isAuthenticated && (

              <div className="pt-4 space-y-2">

                <button
                  onClick={() => navigateToTab('login', null, { mode: 'login' })}
                  className="w-full py-3 rounded-xl bg-slate-800 text-white font-semibold">
                  {t('navbar.login')}
                </button>

              </div>

            )}

          </div>

        </div>

      )}
    </nav>
  );
};