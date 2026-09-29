import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, MoreVertical, ShieldAlert, Mail, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
  const { t } = useTranslation();

  const [usersList, setUsersList] = useState([
    { id: '101', name: 'Aman Sharma', email: 'aman@example.com', joinDate: '2023-11-15', status: 'Active', bookings: 3 },
    { id: '102', name: 'Priya Patel', email: 'priya@example.com', joinDate: '2024-01-22', status: 'Active', bookings: 1 },
    { id: '103', name: 'Rahul Kumar', email: 'rahul@example.com', joinDate: '2024-03-05', status: 'Suspended', bookings: 0 },
    { id: '104', name: 'Neha Gupta', email: 'neha@example.com', joinDate: '2024-06-12', status: 'Active', bookings: 5 },
  ]);

  const handleAddUser = () => {
    const newUser = { id: Date.now().toString(), name: 'New Client', email: 'new@client.com', joinDate: 'Just Now', status: 'Active', bookings: 0 };
    setUsersList([...usersList, newUser]);
    toast.success('New client added!');
  };

  const handleRemoveUser = (id) => {
    setUsersList(usersList.filter(u => u.id !== id));
    toast.success('Client account removed.');
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = usersList.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminUsers.clientManagement')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminUsers.viewAndManageRegi')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('adminUsers.searchClients')} 
              className="w-full sm:w-64 bg-slate-900 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <button 
            onClick={handleAddUser}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      <div className="glass-card border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-bold tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">{t('adminUsers.client')}</th>
                <th className="px-6 py-4">{t('adminUsers.contact')}</th>
                <th className="px-6 py-4">{t('adminUsers.joined')}</th>
                <th className="px-6 py-4 text-center">{t('adminUsers.bookings')}</th>
                <th className="px-6 py-4">{t('adminUsers.status')}</th>
                <th className="px-6 py-4 text-right">{t('adminUsers.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-slate-500">{t('adminUsers.iDUserId')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3 h-3" /> {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.joinDate}</td>
                  <td className="px-6 py-4 text-center font-bold text-indigo-400">{user.bookings}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-inner ${
                      user.status === 'Active' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleRemoveUser(user.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No clients found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
