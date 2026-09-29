import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { ClientLayout } from './ClientLayout';
import { PhotographerLayout } from './PhotographerLayout';
import { AdminLayout } from './AdminLayout';
import { NotFoundPage } from '../NotFoundPage';

export const PortalRouter = () => {
  const { t } = useTranslation();

  const { activeTab, currentUser, isAuthenticated } = useApp();

  if (!isAuthenticated || !currentUser) {
    return <div className="text-white p-12 text-center font-bold">{t('portalRouter.unauthorizedPlease')}</div>;
  }

  // Parse activeTab, e.g. 'client/dashboard', 'photographer/earnings'
  const [roleStr, page] = activeTab.split('/');
  const role = roleStr.toLowerCase();
  const userRole = currentUser.role.toLowerCase();

  if (role !== userRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0e14] text-center p-12">
        <h1 className="text-4xl font-extrabold text-red-500 mb-4">{t('portalRouter.accessDenied')}</h1>
        <p className="text-slate-400">{t('portalRouter.youDoNotHavePerm')}</p>
      </div>
    );
  }

  switch (role) {
    case 'client':
      return <ClientLayout page={page} />;
    case 'photographer':
      return <PhotographerLayout page={page} />;
    case 'admin':
      return <AdminLayout page={page} />;
    default:
      return <NotFoundPage />;
  }
};
