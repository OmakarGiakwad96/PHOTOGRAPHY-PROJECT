import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../utils/api';

export const AdminCoupons = () => {
  const { t } = useTranslation();

  const [couponsList, setCouponsList] = useState([]);

  useEffect(() => {
    api.get('/admin/coupons').then(res => setCouponsList(res.data)).catch(console.error);
  }, []);

  const handleAddCoupon = async () => {
    const newCoupon = { code: 'NEWPROMO' + Math.floor(Math.random() * 100), discount: '15%', type: 'Percentage', maxUses: 100, usedCount: 0, status: 'Active' };
    try {
      const res = await api.post('/admin/coupons', newCoupon);
      setCouponsList([...couponsList, res.data]);
      toast.success('New coupon created!');
    } catch (err) {
      toast.error('Failed to create coupon');
    }
  };

  const handleRemoveCoupon = async (id) => {
    try {
      await api.delete(`/admin/coupons/${id}`);
      setCouponsList(couponsList.filter(c => c.id !== id));
      toast.success('Coupon deleted.');
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">{t('adminCoupons.couponManagement')}</h2>
          <p className="text-slate-400 font-light mt-1">{t('adminCoupons.createAndManagePl')}</p>
        </div>
        <button 
          onClick={handleAddCoupon}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          {t('adminCoupons.createCoupon')}
        </button>
      </div>

      <div className="glass-card border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-bold tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">{t('adminCoupons.code')}</th>
                <th className="px-6 py-4 text-right">{t('adminCoupons.discount')}</th>
                <th className="px-6 py-4">{t('adminCoupons.type')}</th>
                <th className="px-6 py-4 text-center">{t('adminCoupons.usage')}</th>
                <th className="px-6 py-4 text-center">{t('adminCoupons.status')}</th>
                <th className="px-6 py-4 text-right">{t('adminCoupons.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
              {couponsList.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-800/30 transition-colors animate-fade-in">
                  <td className="px-6 py-4">
                    <span className="font-mono text-amber-400 font-bold px-3 py-1 bg-amber-500/10 rounded-md border border-amber-500/20 tracking-wider">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-white">{coupon.discount}</td>
                  <td className="px-6 py-4">{coupon.type}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-white font-medium">{coupon.usedCount}</span>
                    <span className="text-slate-500"> / {coupon.maxUses}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      coupon.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toast('Edit mode opened for ' + coupon.code, { icon: '✏️', style: { background: '#1e293b', color: '#fff' } })}
                        className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleRemoveCoupon(coupon.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
