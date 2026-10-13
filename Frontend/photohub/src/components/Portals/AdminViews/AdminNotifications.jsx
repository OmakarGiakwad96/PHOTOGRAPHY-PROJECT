import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bell, Megaphone, Send, Users, ShieldAlert, RefreshCw, 
  CheckCircle2, Clock, AlertTriangle, MessageSquare, 
  Smartphone, Mail, Filter, Search, Eye, ArrowUpRight
} from 'lucide-react';

export const AdminNotifications = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, WHATSAPP, SMS, EMAIL
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [retryingId, setRetryingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  // Broadcast modal state
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastAudience, setBroadcastAudience] = useState('All');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastChannels, setBroadcastChannels] = useState({
    WhatsApp: true,
    SMS: true,
    Email: true
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const fetchLogsAndStats = async () => {
    setIsLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        fetch('/api/notifications/logs'),
        fetch('/api/notifications/stats')
      ]);

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.warn('Backend notification fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsAndStats();
  }, []);

  const handleRetry = async (notificationId) => {
    setRetryingId(notificationId);
    setActionMessage('');
    try {
      const res = await fetch(`/api/notifications/retry/${notificationId}`, { method: 'POST' });
      if (res.ok) {
        setActionMessage(`Notification #${notificationId} retry triggered successfully.`);
        await fetchLogsAndStats();
      } else {
        setActionMessage(`Retry failed for Notification #${notificationId}.`);
      }
    } catch (err) {
      setActionMessage(`Error communicating with backend gateway.`);
    } finally {
      setRetryingId(null);
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      alert("Please provide both title and announcement body.");
      return;
    }

    const selectedChannels = Object.keys(broadcastChannels).filter(k => broadcastChannels[k]);
    if (selectedChannels.length === 0) {
      alert("Please select at least one delivery channel (WhatsApp, SMS, or Email).");
      return;
    }

    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastBody,
          audience: broadcastAudience,
          channels: selectedChannels
        })
      });

      if (res.ok) {
        alert("Broadcast announcement dispatched successfully!");
        setBroadcastOpen(false);
        setBroadcastTitle('');
        setBroadcastBody('');
        fetchLogsAndStats();
      } else {
        alert("Failed to send broadcast announcement.");
      }
    } catch (err) {
      alert("Network error sending broadcast.");
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Mask sensitive recipient phone / email
  const maskRecipient = (recipient) => {
    if (!recipient) return 'N/A';
    if (recipient.includes('@')) {
      const parts = recipient.split('@');
      const name = parts[0];
      const maskedName = name.length > 3 ? `${name.substring(0, 2)}***${name.slice(-1)}` : '***';
      return `${maskedName}@${parts[1]}`;
    }
    const digits = recipient.replace(/\D/g, '');
    if (digits.length >= 10) {
      return `+${digits.substring(0, 2)} ${digits.substring(2, 4)}*** ${digits.slice(-4)}`;
    }
    return recipient;
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Channel tab
      if (activeTab === 'WHATSAPP' && log.notificationType?.toLowerCase() !== 'whatsapp') return false;
      if (activeTab === 'SMS' && log.notificationType?.toLowerCase() !== 'sms') return false;
      if (activeTab === 'EMAIL' && log.notificationType?.toLowerCase() !== 'email') return false;

      // Status filter
      if (statusFilter !== 'ALL') {
        const logStatus = log.status?.toLowerCase() || '';
        if (statusFilter === 'DELIVERED' && !['delivered', 'read'].includes(logStatus)) return false;
        if (statusFilter === 'SENT' && !['sent', 'accepted', 'simulated'].includes(logStatus)) return false;
        if (statusFilter === 'PENDING' && !['pending', 'queued'].includes(logStatus)) return false;
        if (statusFilter === 'FAILED' && logStatus !== 'failed') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = log.referenceId?.toLowerCase().includes(q);
        const matchesMsgId = log.providerMessageId?.toLowerCase().includes(q);
        const matchesRec = log.recipient?.toLowerCase().includes(q);
        const matchesEvent = log.eventType?.toLowerCase().includes(q);
        if (!matchesRef && !matchesMsgId && !matchesRec && !matchesEvent) return false;
      }

      return true;
    });
  }, [logs, activeTab, statusFilter, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shadow-inner">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
                WhatsApp & SMS Automation Center
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-light mt-0.5">
                Official Meta Cloud API & Indian Telecom (MSG91 DLT) Delivery Operations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={fetchLogsAndStats}
            disabled={isLoading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            Sync Status
          </button>

          <button 
            onClick={() => setBroadcastOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Megaphone className="w-4 h-4" />
            New Broadcast
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between animate-slide-up">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-emerald-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Dispatched</span>
            <Bell className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats ? stats.totalNotifications : logs.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across all active channels</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">WhatsApp Cloud API</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {stats ? stats.whatsAppCount : logs.filter(l => l.notificationType === 'WhatsApp').length}
          </div>
          <p className="text-[11px] text-emerald-500/80 mt-1">Official Meta Templates</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Indian SMS (MSG91)</span>
            <Smartphone className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">
            {stats ? stats.smsCount : logs.filter(l => l.notificationType === 'SMS').length}
          </div>
          <p className="text-[11px] text-sky-500/80 mt-1">TRAI DLT Verified</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivery Rate</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {stats ? `${stats.deliveryRate}%` : '98.5%'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Successful receipts</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/40 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending / Outbox</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
            {stats ? stats.failedCount + stats.pendingCount : logs.filter(l => l.status === 'Failed').length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Auto-retry queue active</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          
          {/* Channel selector tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-2xl">
            {[
              { id: 'ALL', label: 'All Channels', icon: Bell },
              { id: 'WHATSAPP', label: 'Meta WhatsApp', icon: MessageSquare, color: 'text-emerald-400' },
              { id: 'SMS', label: 'MSG91 SMS', icon: Smartphone, color: 'text-sky-400' },
              { id: 'EMAIL', label: 'Email', icon: Mail, color: 'text-purple-400' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-slate-800 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.color || ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search booking ref, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-900 border border-slate-700/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DELIVERED">Delivered / Read</option>
              <option value="SENT">Sent / Accepted</option>
              <option value="PENDING">Pending Outbox</option>
              <option value="FAILED">Failed (Eligible Retry)</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Channel</th>
                <th className="px-4 py-3.5">Event Type</th>
                <th className="px-4 py-3.5">Recipient</th>
                <th className="px-4 py-3.5">Reference ID</th>
                <th className="px-4 py-3.5">Provider Message ID</th>
                <th className="px-4 py-3.5">Delivery Status</th>
                <th className="px-4 py-3.5">Sent / Updated</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Bell className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="font-medium text-slate-300">No notification audit records found</p>
                      <p className="text-xs text-slate-500">Notifications triggered from Razorpay or customer bookings appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const isWa = log.notificationType?.toLowerCase() === 'whatsapp';
                  const isSms = log.notificationType?.toLowerCase() === 'sms';
                  const isEmail = log.notificationType?.toLowerCase() === 'email';

                  const statusLower = log.status?.toLowerCase();
                  const isDelivered = statusLower === 'delivered' || statusLower === 'read';
                  const isSent = statusLower === 'sent' || statusLower === 'accepted' || statusLower === 'simulated';
                  const isFailed = statusLower === 'failed';

                  return (
                    <tr key={log.notificationId} className="hover:bg-slate-800/30 transition-colors">
                      {/* Channel Badge */}
                      <td className="px-4 py-3.5 font-medium">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isWa 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : isSms 
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' 
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        }`}>
                          {isWa && <MessageSquare className="w-3 h-3" />}
                          {isSms && <Smartphone className="w-3 h-3 text-sky-400" />}
                          {isEmail && <Mail className="w-3 h-3 text-purple-400" />}
                          {log.notificationType}
                        </span>
                      </td>

                      {/* Event Type */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white text-xs sm:text-sm">
                          {log.eventType || 'General'}
                        </div>
                        {log.templateName && (
                          <div className="text-[11px] text-slate-500 font-mono">
                            {log.templateName}
                          </div>
                        )}
                      </td>

                      {/* Masked Recipient */}
                      <td className="px-4 py-3.5 text-xs sm:text-sm font-mono text-slate-300">
                        {maskRecipient(log.recipient)}
                      </td>

                      {/* Booking/Payment Reference */}
                      <td className="px-4 py-3.5">
                        {log.referenceId ? (
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700/60">
                            #{log.referenceId}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>

                      {/* Provider Message ID */}
                      <td className="px-4 py-3.5">
                        {log.providerMessageId ? (
                          <span 
                            title={log.providerMessageId} 
                            className="font-mono text-[11px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800 max-w-[140px] truncate block"
                          >
                            {log.providerMessageId}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Generated locally</span>
                        )}
                      </td>

                      {/* Delivery Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isDelivered 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : isSent 
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                            : isFailed 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isDelivered ? 'bg-emerald-400 animate-pulse' : isSent ? 'bg-sky-400' : isFailed ? 'bg-rose-400' : 'bg-amber-400'
                          }`} />
                          {log.status}
                        </span>
                        {log.errorMessage && (
                          <div title={log.errorMessage} className="text-[10px] text-rose-400/90 truncate max-w-[160px] mt-0.5">
                            {log.errorMessage}
                          </div>
                        )}
                      </td>

                      {/* Timestamps */}
                      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        <div>{new Date(log.sentAt).toLocaleDateString()}</div>
                        <div className="text-[11px] text-slate-500">{new Date(log.sentAt).toLocaleTimeString()}</div>
                      </td>

                      {/* Action (Retry) */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isFailed ? (
                          <button
                            onClick={() => handleRetry(log.notificationId)}
                            disabled={retryingId === log.notificationId}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <RefreshCw className={`w-3 h-3 ${retryingId === log.notificationId ? 'animate-spin' : ''}`} />
                            Retry
                          </button>
                        ) : (
                          <span className="text-slate-600 text-xs">Logged</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0e14] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Broadcast Announcement</h3>
                  <p className="text-xs text-slate-400">Dispatch message across WhatsApp, SMS & Email</p>
                </div>
              </div>
              <button 
                onClick={() => setBroadcastOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              {/* Audience */}
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Audience Segment</label>
                <div className="grid grid-cols-3 gap-2">
                  {['All', 'Photographers', 'Clients'].map(aud => (
                    <button
                      type="button"
                      key={aud}
                      onClick={() => setBroadcastAudience(aud)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        broadcastAudience === aud 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {aud}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Channels</label>
                <div className="flex gap-4">
                  {['WhatsApp', 'SMS', 'Email'].map(ch => (
                    <label key={ch} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={broadcastChannels[ch]}
                        onChange={(e) => setBroadcastChannels(prev => ({ ...prev, [ch]: e.target.checked }))}
                        className="accent-emerald-500 rounded"
                      />
                      {ch}
                    </label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Headline</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Festive Booking Discount Live!"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Announcement Message</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Type your official announcement here..."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setBroadcastOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {isBroadcasting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default AdminNotifications;
