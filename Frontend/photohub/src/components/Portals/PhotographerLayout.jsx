import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Calendar, Users, Camera, DollarSign, BarChart2, Star, 
  MessageSquare, Bell, ShieldCheck, Settings, LogOut, Menu, X, Image, User, Package
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlaceholderFeature } from './PlaceholderFeature';
import { PhotoShoots } from './PhotographerViews/PhotoShoots';
import { PhotoEvents } from './PhotographerViews/PhotoEvents';
import { PhotoPortfolio } from './PhotographerViews/PhotoPortfolio';
import { PhotoRequests } from './PhotographerViews/PhotoRequests';
import { PhotoEarnings } from './PhotographerViews/PhotoEarnings';
import { PhotoAnalytics } from './PhotographerViews/PhotoAnalytics';
import { PhotoReviews } from './PhotographerViews/PhotoReviews';
import { PhotoMessages } from './PhotographerViews/PhotoMessages';
import { PhotoNotifications } from './PhotographerViews/PhotoNotifications';
import { PhotoVerification } from './PhotographerViews/PhotoVerification';
import { PhotoSettings } from './PhotographerViews/PhotoSettings';
import { PhotoProfileEdit } from './PhotographerViews/PhotoProfileEdit';
import { PhotoPackages } from './PhotographerViews/PhotoPackages';

export const PhotographerLayout = ({ page }) => {
  const { t } = useTranslation();

  const { currentUser, logoutUser, navigateToTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'portfolio', label: 'My Portfolio', icon: Image },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'shoots', label: 'Today\'s Shoots', icon: Camera },
    { id: 'events', label: 'Upcoming Events', icon: Calendar },
    { id: 'requests', label: 'Booking Requests', icon: Users },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id) => {
    navigateToTab(`photographer/${id}`);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (page) {
      case 'dashboard':
        return <PlaceholderFeature title="Photographer Dashboard" />;
      case 'shoots':
        return <PhotoShoots />;
      case 'events':
        return <PhotoEvents />;
      case 'portfolio':
        return <PhotoPortfolio />;
      case 'requests':
        return <PhotoRequests />;
      case 'earnings':
        return <PhotoEarnings />;
      case 'analytics':
        return <PhotoAnalytics />;
      case 'reviews':
        return <PhotoReviews />;
      case 'notifications':
        return <PhotoNotifications />;
      case 'profile':
        return <PhotoProfileEdit />;
      case 'packages':
        return <PhotoPackages />;
      case 'settings':
        return <PhotoSettings />;
      default:
        const link = navLinks.find(l => l.id === page);
        return <PlaceholderFeature title={link ? link.label : 'Feature Coming Soon'} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/80 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-lg leading-none">{t('photographerLayout.photoHub')}</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{t('photographerLayout.photographer')}</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = page === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_2px_0_0_0_#10b981]' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={() => { logoutUser(); navigateToTab('home'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-slate-950/50 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white capitalize hidden sm:block">
              {page.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <button onClick={() => navigateToTab('photographer/notifications')} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition">
               <Bell className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-white">{currentUser.name}</p>
                 <p className="text-[10px] font-bold text-emerald-400 uppercase">{currentUser.role}</p>
               </div>
               <img src={currentUser.profile_picture} alt={t('photographerLayout.profile')} className="w-10 h-10 rounded-xl border border-slate-700 object-cover" />
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
