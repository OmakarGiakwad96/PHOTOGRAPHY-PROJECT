import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Type, Layout, Image as ImageIcon, Save, Loader2, Plus, Trash2, Link, MessageCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../utils/api';

export const AdminCMS = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Hero Section');
  const [isSaving, setIsSaving] = useState(false);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    api.get('/admin/cms').then(res => {
      if(res.data && res.data.faqsJson) {
        try {
          setFaqs(JSON.parse(res.data.faqsJson));
        } catch(e) {}
      }
    }).catch(console.error);
  }, []);

  const handleAddFaq = () => {
    const newFaq = { id: Date.now(), question: '', answer: '' };
    setFaqs([...faqs, newFaq]);
  };

  const handleRemoveFaq = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/admin/cms', { faqsJson: JSON.stringify(faqs) });
      toast.success('Changes saved successfully!');
    } catch (err) {
      toast.error('Failed to save CMS changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminCMS.contentManagement')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminCMS.editLandingPageCo')}</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : t('adminCMS.saveChanges')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {['Hero Section', 'About Us', 'FAQs', 'Footer Links'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeTab === 'Hero Section' && (
            <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl">
            <h3 className="font-bold text-white mb-6 font-serif text-lg flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-400" />
              {t('adminCMS.heroSectionEditor')}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-3 h-3" />
{t('adminCMS.mainHeadline')}
</label>
                <input 
                  type="text" 
                  defaultValue="Capture Life's Best Moments"
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-serif text-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3 h-3" />
{t('adminCMS.subheading')}
</label>
                <textarea 
                  defaultValue="Find and book the perfect photographer for your next event, instantly."
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" />
{t('adminCMS.heroBackgroundImag')}
</label>
                <div 
                  onClick={() => toast('Image browser opened', { icon: '🖼️', style: { background: '#1e293b', color: '#fff' } })}
                  className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-900/50 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg')] bg-cover bg-center opacity-30 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative z-10">
                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-3 drop-shadow-md" />
                    <p className="text-sm text-white font-bold mb-1 drop-shadow-md">{t('adminCMS.clickToUploadNew')}</p>
                    <p className="text-xs text-slate-300 font-medium drop-shadow-md">{t('adminCMS.recommendedSize19')}</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}

          {activeTab === 'About Us' && (
            <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl animate-fade-in">
              <h3 className="font-bold text-white mb-6 font-serif text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" />
                About Us Editor
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Our Story
                  </label>
                  <textarea 
                    defaultValue="We are a platform dedicated to connecting clients with world-class photographers for all of their special moments."
                    className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-32 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Type className="w-3 h-3" /> Mission Statement
                  </label>
                  <input 
                    type="text" 
                    defaultValue="Empowering creativity through the lens."
                    className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-serif text-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FAQs' && (
            <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white font-serif text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-indigo-400" />
                  FAQs Editor
                </h3>
                <button 
                  onClick={handleAddFaq}
                  className="text-sm bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {faqs.map(faq => (
                  <div key={faq.id} className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl space-y-3 relative group animate-fade-in">
                    <button 
                      onClick={() => handleRemoveFaq(faq.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <input 
                      type="text" 
                      defaultValue={faq.question}
                      placeholder="FAQ Question"
                      className="w-full bg-slate-900 border border-slate-700/50 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-indigo-500 pr-10"
                    />
                    <textarea 
                      defaultValue={faq.answer}
                      placeholder="FAQ Answer"
                      className="w-full bg-slate-900 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-indigo-500 h-20 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Footer Links' && (
            <div className="glass-card p-6 sm:p-8 border border-slate-700/60 rounded-3xl animate-fade-in">
              <h3 className="font-bold text-white mb-6 font-serif text-lg flex items-center gap-2">
                <Link className="w-5 h-5 text-indigo-400" />
                Footer Links Editor
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Link className="w-3 h-3" /> Instagram URL
                  </label>
                  <input 
                    type="text" 
                    defaultValue="https://instagram.com/photohub"
                    className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-indigo-400 font-mono text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Link className="w-3 h-3" /> Facebook URL
                  </label>
                  <input 
                    type="text" 
                    defaultValue="https://facebook.com/photohub"
                    className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-indigo-400 font-mono text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Type className="w-3 h-3" /> Copyright Text
                  </label>
                  <input 
                    type="text" 
                    defaultValue="© 2026 PhotoHub. All rights reserved."
                    className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
