import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Users, Camera, DollarSign, BarChart2, Star, 
  MessageSquare, Bell, ShieldCheck, Settings, LogOut, Menu, X, Gift,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlaceholderFeature } from './PlaceholderFeature';
import { AdminRevenue } from './AdminViews/AdminRevenue';
import { AdminUsers } from './AdminViews/AdminUsers';
import { AdminPhotographers } from './AdminViews/AdminPhotographers';
import { AdminReports } from './AdminViews/AdminReports';
import { AdminAnalytics } from './AdminViews/AdminAnalytics';
import { AdminPayments } from './AdminViews/AdminPayments';
import { AdminCMS } from './AdminViews/AdminCMS';
import { AdminSupport } from './AdminViews/AdminSupport';
import { AdminCoupons } from './AdminViews/AdminCoupons';
import { AdminReferrals } from './AdminViews/AdminReferrals';
import { AdminSettings } from './AdminViews/AdminSettings';

export const AdminLayout = ({ page }) => {
  const { t } = useTranslation();

  const { currentUser, logoutUser, navigateToTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'DASHBOARD', isHeading: true },
    { id: 'revenue', label: 'Total Revenue', icon: DollarSign },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'photographers', label: 'Photographers', icon: Camera },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'cms', label: 'CMS', icon: FileText },
    { id: 'support', label: 'Support Tickets', icon: MessageSquare },
    { id: 'coupons', label: 'Coupons', icon: Gift },
    { id: 'referrals', label: 'Referral System', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id) => {
    navigateToTab(`admin/${id}`);
    setSidebarOpen(false);
  };

  const renderContent = () => {

    switch (page) {
      case 'dashboard':
        return <PlaceholderFeature title="Admin Dashboard" />;
      case 'revenue':
        return <AdminRevenue />;
      case 'users':
        return <AdminUsers />;
      case 'photographers':
        return <AdminPhotographers />;
      case 'reports':
        return <AdminReports />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'payments':
        return <AdminPayments />;
      case 'cms':
        return <AdminCMS />;
      case 'support':
        return <AdminSupport />;
      case 'coupons':
        return <AdminCoupons />;
      case 'referrals':
        return <AdminReferrals />;
      case 'settings':
        return <AdminSettings />;
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
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-lg leading-none">{t('adminLayout.photoHub')}</h1>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{t('adminLayout.adminPanel')}</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
          {navLinks.map((link) => {
            if (link.isHeading) {
              return (
                <div key={link.id} className="px-4 py-2 mt-2 text-xs font-bold text-slate-500 tracking-widest">
                  {link.label}
                </div>
              );
            }
            const Icon = link.icon;
            const isActive = page === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-500/10 text-purple-400 shadow-[inset_2px_0_0_0_#a855f7]' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
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
{t('adminLayout.signOut')}
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
             <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-white">{currentUser.name}</p>
                 <p className="text-[10px] font-bold text-purple-400 uppercase">{currentUser.role}</p>
               </div>
               <img src={currentUser.profile_picture} alt={t('adminLayout.profile')} className="w-10 h-10 rounded-xl border border-slate-700 object-cover" />
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
