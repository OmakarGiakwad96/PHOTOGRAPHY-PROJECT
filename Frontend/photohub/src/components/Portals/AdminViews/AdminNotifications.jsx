import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Megaphone, Send, Users, Camera, ShieldAlert } from 'lucide-react';

export const AdminNotifications = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/notifications/logs');
        if (!response.ok) throw new Error('Failed to fetch logs');
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);


  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminNotifications.systemNotifications')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminNotifications.broadcastAnnounceme')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
            <h3 className="font-bold text-white mb-6 font-serif text-lg flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-400" />
              {t('adminNotifications.broadcastMessage')}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('adminNotifications.audience')}</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name="audience" defaultChecked className="accent-indigo-500" />
{t('adminNotifications.allUsers')}
</label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name="audience" className="accent-indigo-500" />
{t('adminNotifications.photographersOnly')}
</label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name="audience" className="accent-indigo-500" />
{t('adminNotifications.clientsOnly')}
</label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('adminNotifications.title')}</label>
                <input 
                  type="text" 
                  placeholder={t('adminNotifications.announcementTitle')}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('adminNotifications.messageBody')}</label>
                <textarea 
                  placeholder={t('adminNotifications.typeYourMessageHe')}
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-32 resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800/80">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
                  <Send className="w-4 h-4" />
{t('adminNotifications.sendBroadcast')}
</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border border-slate-700/60 rounded-3xl h-full">
            <h3 className="font-bold text-white mb-6 font-serif text-lg">{t('adminNotifications.systemAlerts')}</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{t('adminNotifications.failedPayouts')}</h4>
                  <p className="text-xs text-slate-400">{t('adminNotifications.3PhotographerPayou')}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{t('adminNotifications.pendingVerification')}</h4>
                  <p className="text-xs text-slate-400">{t('adminNotifications.14PhotographersAre')}</p>
                <div className="mt-8">
  <h3 className="text-xl font-bold text-white mb-4">{t('adminNotifications.notificationLogs')}</h3>
  {logs.length === 0 ? (
    <p className="text-slate-400">{t('adminNotifications.noLogs')}</p>
  ) : (
    <table className="w-full text-sm text-left text-slate-300">
      <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-bold tracking-widest border-b border-slate-800">
        <tr>
          <th className="px-4 py-2">{t('adminNotifications.recipient')}</th>
          <th className="px-4 py-2">{t('adminNotifications.type')}</th>
          <th className="px-4 py-2">{t('adminNotifications.event')}</th>
          <th className="px-4 py-2">{t('adminNotifications.status')}</th>
          <th className="px-4 py-2">{t('adminNotifications.sentAt')}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
        {logs.map((log) => (
          <tr key={log.notificationId} className="hover:bg-slate-800/30 transition-colors">
            <td className="px-4 py-2">{log.recipient}</td>
            <td className="px-4 py-2">{log.notificationType}</td>
            <td className="px-4 py-2">{log.eventType}</td>
            <td className="px-4 py-2">{log.status}</td>
            <td className="px-4 py-2">{new Date(log.sentAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
</div>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{t('adminNotifications.trafficSpike')}</h4>
                  <p className="text-xs text-slate-400">{t('adminNotifications.unusuallyHighTraff')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
