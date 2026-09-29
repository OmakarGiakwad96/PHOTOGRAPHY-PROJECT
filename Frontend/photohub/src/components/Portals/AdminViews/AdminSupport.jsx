import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Search, AlertCircle, CheckCircle, Clock, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../utils/api';

export const AdminSupport = () => {
  const { t } = useTranslation();

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.get('/admin/tickets').then(res => setTickets(res.data)).catch(console.error);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filteredTickets = tickets.filter(ticket => 
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminSupport.supportDesk')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminSupport.manageAndResolveU')}</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('adminSupport.searchTickets')} 
            className="w-full sm:w-64 bg-slate-900 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      <div className="glass-card border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-bold tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">{t('adminSupport.ticket')}</th>
                <th className="px-6 py-4">{t('adminSupport.subject')}</th>
                <th className="px-6 py-4">{t('adminSupport.user')}</th>
                <th className="px-6 py-4 text-center">{t('adminSupport.priority')}</th>
                <th className="px-6 py-4 text-center">{t('adminSupport.status')}</th>
                <th className="px-6 py-4 text-right">{t('adminSupport.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
              {filteredTickets.length > 0 ? filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-indigo-400 font-bold">{ticket.id}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {ticket.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{ticket.subject}</td>
                  <td className="px-6 py-4">{ticket.user}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      ticket.priority === 'High' ? 'bg-rose-500/20 text-rose-400' :
                      ticket.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {ticket.status === t('adminSupport.open') && <span className="text-rose-400 flex items-center justify-center gap-1 text-xs font-bold"><AlertCircle className="w-4 h-4" /> Open</span>}
                    {ticket.status === t('adminSupport.pending') && <span className="text-amber-400 flex items-center justify-center gap-1 text-xs font-bold"><Clock className="w-4 h-4" /> Pending</span>}
                    {ticket.status === t('adminSupport.closed') && <span className="text-slate-500 flex items-center justify-center gap-1 text-xs font-bold"><CheckCircle className="w-4 h-4" /> Closed</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No support tickets found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950/50">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded">{selectedTicket.id}</span>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      selectedTicket.priority === 'High' ? 'bg-rose-500/20 text-rose-400' :
                      selectedTicket.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                  }`}>{selectedTicket.priority}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedTicket.subject}</h3>
                <p className="text-sm text-slate-400 mt-1">From: <span className="text-slate-200">{selectedTicket.user}</span> • {selectedTicket.time}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 bg-slate-900/50 flex-1 overflow-y-auto min-h-[200px]">
              <div className="bg-slate-800/40 p-4 rounded-xl rounded-tl-none inline-block max-w-[80%] border border-slate-700/50 mb-6">
                <p className="text-sm text-slate-300">I need help with this issue. Please respond as soon as possible.</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-950/30">
              <div className="flex gap-3">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="flex-1 bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 h-12 min-h-[48px] max-h-32 resize-y"
                />
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      toast.success('Reply sent successfully!');
                      setReplyText('');
                      setSelectedTicket(null);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors h-12"
                  >
                    <Send className="w-4 h-4" /> Reply
                  </button>
                  {(selectedTicket.status !== 'Closed' && selectedTicket.status !== t('adminSupport.closed')) && (
                    <button 
                      onClick={async () => {
                        try {
                          const res = await api.put(`/admin/tickets/${selectedTicket.id}`, { ...selectedTicket, status: 'Closed' });
                          setTickets(tickets.map(t => t.id === selectedTicket.id ? res.data : t));
                          toast.success('Ticket marked as closed.');
                          setSelectedTicket(null);
                        } catch (err) {
                          toast.error('Failed to update ticket');
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                    >
                      Mark Closed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
