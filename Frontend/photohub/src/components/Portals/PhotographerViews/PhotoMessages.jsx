import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Search, Send, Image as ImageIcon, MoreVertical } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const PhotoMessages = () => {
  const { t } = useTranslation();

  const { bookings } = useApp();
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');
  const [newMessages, setNewMessages] = useState({});

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNewMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));
    setMessage('');
  };

  // Mock chat list using booking data to simulate clients
  const chatList = [
    { id: 1, name: 'Aman Sharma', avatar: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg', lastMessage: 'Yes, 2 PM works perfectly!', time: '10:45 AM', unread: 1 },
    { id: 2, name: 'Priya Patel', avatar: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606960/photohub/images/faces/faces-2.jpg', lastMessage: 'When will the album be ready?', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Rahul Kumar', avatar: '/images/faces/faces-3.webp', lastMessage: 'Thanks again for the great shoot.', time: 'Mon', unread: 0 }
  ];

  const activeClient = chatList.find(c => c.id === activeChat);

  return (
    <div className="h-[calc(100vh-80px)] p-6 lg:p-10 flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('photoMessages.messages')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('photoMessages.communicateWithYou')}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden flex shadow-2xl">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-slate-800/80 flex flex-col bg-slate-950/30 shrink-0 hidden md:flex">
          <div className="p-4 border-b border-slate-800/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder={t('photoMessages.searchClients')} 
                className="w-full bg-slate-900 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {chatList.map(chat => (
              <button 
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full text-left p-4 flex items-start gap-3 transition-colors border-b border-slate-800/40 ${
                  activeChat === chat.id ? 'bg-amber-500/10' : 'hover:bg-slate-800/30'
                }`}
              >
                <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-white truncate">{chat.name}</h4>
                    <span className="text-[10px] text-slate-500">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? 'text-amber-400 font-medium' : 'text-slate-400'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-slate-900">{chat.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-900/20">
          {activeClient ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/50 shrink-0">
                <div className="flex items-center gap-3">
                  <img src={activeClient.avatar} alt={activeClient.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{activeClient.name}</h3>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                    </p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">{t('photoMessages.today')}</span>
                </div>
                
                <div className="flex items-end gap-2 max-w-[80%] ml-auto justify-end">
                  <div className="bg-amber-500 rounded-2xl rounded-br-none px-4 py-2.5 text-sm text-slate-900 font-medium">
                    Hi {activeClient.name.split(' ')[0]}! Just confirming our shoot tomorrow at 2 PM.
                    <span className="block text-[9px] text-slate-800 mt-1 text-right">{t('photoMessages.1040AM')}</span>
                  </div>
                </div>

                <div className="flex items-end gap-2 max-w-[80%]">
                  <img src={activeClient.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                  <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm text-slate-200">
                    Yes, 2 PM works perfectly! Should I bring any specific props?
                    <span className="block text-[9px] text-slate-500 mt-1">{t('photoMessages.1045AM')}</span>
                  </div>
                </div>

                {(newMessages[activeChat] || []).map(msg => (
                  <div key={msg.id} className="flex items-end gap-2 max-w-[80%] ml-auto justify-end animate-fade-in">
                    <div className="bg-amber-500 rounded-2xl rounded-br-none px-4 py-2.5 text-sm text-slate-900 font-medium">
                      {msg.text}
                      <span className="block text-[9px] text-slate-800 mt-1 text-right">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 shrink-0">
                <form 
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3 bg-slate-900 border border-slate-700/50 rounded-xl p-2"
                >
                  <button type="button" className="p-2 text-slate-400 hover:text-amber-400 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('photoMessages.typeAMessage')}
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    disabled={!message.trim()}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-amber-500"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 h-full">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p>{t('photoMessages.selectAClientToS')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
