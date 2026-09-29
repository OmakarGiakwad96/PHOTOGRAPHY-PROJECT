import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VendorAvailabilityCalendar = ({ token }) => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState(() => {
    try {
      const saved = localStorage.getItem('photohub_blocked_dates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const toggleDate = (day) => {
    const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setBlockedDates(prev => prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]);
  };

  const saveAvailability = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      // Mock network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('photohub_blocked_dates', JSON.stringify(blockedDates));
      setSaveStatus('success');
    } catch (error) {
      console.error('Failed to save availability', error);
      setSaveStatus('error');
    }
    setIsSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><CalendarIcon className="w-5 h-5" /></div>
          <div>
            <h3 className="font-bold text-gray-900">{t('calendar.manage')}</h3>
            <p className="text-sm text-gray-500">{t('calendar.blockDates')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'success' && <span className="text-sm font-medium text-emerald-600 animate-fade-in">{t('calendar.success')}</span>}
          {saveStatus === 'error' && <span className="text-sm font-medium text-rose-600 animate-fade-in">{t('calendar.error')}</span>}
          <button onClick={saveAvailability} disabled={isSaving} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {isSaving ? t('calendar.saving') : t('calendar.saveChanges')}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 border rounded-lg hover:bg-gray-50"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
            <button onClick={handleNextMonth} className="p-2 border rounded-lg hover:bg-gray-50"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">{t(`calendar.${day}`)}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="aspect-square rounded-xl bg-gray-50/50" />)}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            const isBlocked = blockedDates.includes(dateStr);
            const isToday = formatDate(new Date()) === dateStr;

            return (
              <button key={day} onClick={() => toggleDate(day)} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all border-2 ${isBlocked ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'} ${isToday ? 'ring-2 ring-offset-2 ring-[#E91E63]' : ''}`}>
                <span className="text-lg font-bold">{day}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider opacity-80 mt-0.5">{isBlocked ? t('calendar.blocked') : t('calendar.free')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VendorAvailabilityCalendar;
