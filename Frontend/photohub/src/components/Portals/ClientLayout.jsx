import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Home, Search, Calendar, Bookmark, MessageSquare, Bell, 
  CreditCard, FileText, Download, Gift, Tag, HelpCircle, 
  User, Settings, LogOut, Menu, X, Camera 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClientHome } from './ClientHome';
import { PlaceholderFeature } from './PlaceholderFeature';
import { PhotographersDirectory } from '../PhotographersDirectory';
import { ClientBookings } from './ClientViews/ClientBookings';
import { ClientSaved } from './ClientViews/ClientSaved';
import { ClientMessages } from './ClientViews/ClientMessages';
import { ClientNotifications } from './ClientViews/ClientNotifications';
import { ClientPayments } from './ClientViews/ClientPayments';
import { ClientInvoices } from './ClientViews/ClientInvoices';

import { ClientRewards } from './ClientViews/ClientRewards';
import { ClientCoupons } from './ClientViews/ClientCoupons';
import { ClientProfile } from './ClientViews/ClientProfile';
import { ClientSettings } from './ClientViews/ClientSettings';
import { ClientSupport } from './ClientViews/ClientSupport';

export const ClientLayout = ({ page }) => {
  const { t } = useTranslation();

  const { currentUser, logoutUser, navigateToTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'find-photographer', label: 'Find Photographers', icon: Search },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'saved', label: 'Saved Photographers', icon: Bookmark },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: FileText },

    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id) => {
    navigateToTab(`client/${id}`);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (page) {
      case 'home':
        return <ClientHome />;
      case 'find-photographer':
        return <PhotographersDirectory />;
      case 'bookings':
        return <ClientBookings />;
      case 'saved':
        return <ClientSaved />;
      case 'notifications':
        return <ClientNotifications />;
      case 'payments':
        return <ClientPayments />;
      case 'invoices':
        return <ClientInvoices />;

      case 'rewards':
        return <ClientRewards />;
      case 'coupons':
        return <ClientCoupons />;
      case 'support':
        return <ClientSupport />;
      case 'profile':
        return <ClientProfile />;
      case 'settings':
        return <ClientSettings />;
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
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Camera className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-lg leading-none">{t('clientLayout.photoHub')}</h1>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{t('clientLayout.clientPortal')}</p>
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
                    ? 'bg-amber-500/10 text-amber-400 shadow-[inset_2px_0_0_0_#f59e0b]' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
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
             <button onClick={() => navigateToTab('client/notifications')} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 transition">
               <Bell className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-white">{currentUser.name}</p>
                 <p className="text-[10px] font-bold text-amber-400 uppercase">{currentUser.role}</p>
               </div>
               <img src={currentUser.profile_picture} alt={t('clientLayout.profile')} className="w-10 h-10 rounded-xl border border-slate-700 object-cover" />
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
