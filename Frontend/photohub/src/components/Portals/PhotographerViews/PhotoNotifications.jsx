import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Calendar, IndianRupee, MessageSquare, Star, Clock } from 'lucide-react';

export const PhotoNotifications = () => {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'booking', title: 'New Booking Request', desc: 'Aman Sharma has requested a Pre-Wedding Shoot for Oct 15.', time: '2 hours ago', unread: true, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 2, type: 'payment', title: 'Payment Received', desc: 'You received ₹15,000 for Booking #4892.', time: 'Yesterday', unread: true, icon: IndianRupee, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 3, type: 'review', title: 'New 5-Star Review', desc: 'Rahul K. left a new review on your profile.', time: '2 days ago', unread: false, icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 4, type: 'message', title: 'New Message', desc: 'Priya Patel sent you a message regarding album delivery.', time: '1 week ago', unread: false, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoNotifications.notifications')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoNotifications.stayUpdatedOnClie')}</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">{t('photoNotifications.youReAllCaughtUp')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {notifications.map(n => {
              const Icon = n.icon;
              return (
                <div key={n.id} className={`p-6 flex items-start gap-5 transition-colors ${n.unread ? 'bg-slate-800/20' : 'hover:bg-slate-800/10'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${n.bg}`}>
                    <Icon className={`w-5 h-5 ${n.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-base font-bold ${n.unread ? 'text-white' : 'text-slate-300'}`}>{n.title}</h4>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0 mt-1">
                        <Clock className="w-3 h-3" />
                        {n.time}
                      </span>
                    </div>
                    <p className={`text-sm ${n.unread ? 'text-slate-300' : 'text-slate-400'}`}>{n.desc}</p>
                  </div>
                  {n.unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-2"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
