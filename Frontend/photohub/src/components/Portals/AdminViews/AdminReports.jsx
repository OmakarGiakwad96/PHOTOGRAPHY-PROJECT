import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Filter, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReports = () => {
  const { t } = useTranslation();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('New report generated successfully!');
    }, 1500);
  };

  const handleDownload = (report) => {
    setDownloadingId(report.id);
    setTimeout(() => {
      setDownloadingId(null);
      toast.success(`Downloaded: ${report.name}`);
    }, 1000);
  };

  const handleFilter = () => {
    toast('Filter panel opened', { icon: '🔍', style: { background: '#1e293b', color: '#fff' } });
  };

  const reports = [
    { id: 1, name: 'Monthly Tax Report - October 2026', type: 'Tax', date: 'Nov 1, 2026', size: '2.4 MB' },
    { id: 2, name: 'Q3 Financial Summary', type: 'Financial', date: 'Oct 5, 2026', size: '5.1 MB' },
    { id: 3, name: 'User Growth & Churn Metrics', type: 'Analytics', date: 'Oct 1, 2026', size: '1.2 MB' },
    { id: 4, name: 'Photographer Payout Ledger - September', type: 'Payouts', date: 'Oct 1, 2026', size: '3.8 MB' },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminReports.reportsHub')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminReports.generateAndDownloa')}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={handleFilter}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-700/50 transition-colors"
          >
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 font-medium text-sm">{t('adminReports.filter')}</span>
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl transition-colors font-bold text-sm shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isGenerating ? 'Generating...' : t('adminReports.generateNew')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['Tax', 'Financial', 'Analytics', 'Payouts'].map((type) => (
          <div 
            key={type} 
            onClick={() => toast.success(`Viewing ${type} Reports`)}
            className="glass-card p-6 border border-slate-700/60 rounded-3xl hover:border-indigo-500/30 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/10 transition-colors">
              <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-lg mb-1">{type} Reports</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
{t('adminReports.autoGeneratesMonth')}
</p>
          </div>
        ))}
      </div>

      <div className="glass-card border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white font-serif">{t('adminReports.recentDownloads')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-bold tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">{t('adminReports.reportName')}</th>
                <th className="px-6 py-4">{t('adminReports.type')}</th>
                <th className="px-6 py-4">{t('adminReports.dateGenerated')}</th>
                <th className="px-6 py-4">{t('adminReports.size')}</th>
                <th className="px-6 py-4 text-right">{t('adminReports.download')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-500" />
                    {report.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{report.date}</td>
                  <td className="px-6 py-4 text-slate-400">{report.size}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDownload(report)}
                      disabled={downloadingId === report.id}
                      className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors border border-indigo-500/20 disabled:opacity-50"
                    >
                      {downloadingId === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
