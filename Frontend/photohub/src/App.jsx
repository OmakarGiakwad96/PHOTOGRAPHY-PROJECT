import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PortalRouter } from './components/Portals/PortalRouter';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { PhotographersSection } from './components/PhotographersSection';
import { BookingStepsSection } from './components/BookingStepsSection';
import { PhotographersDirectory } from './components/PhotographersDirectory';
import { PackagesSection } from './components/PackagesSection';
import { GallerySection } from './components/GallerySection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { PhotographerDetailModal } from './components/PhotographerDetailModal';
import { BookingModal } from './components/BookingModal';
import { AuthPage } from './components/AuthPage';
import { ChatbotWidget } from './components/ChatbotWidget';

import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPage';
import { HelpCenter } from './components/HelpCenter';
import { NotFoundPage } from './components/NotFoundPage';
import { PhotographerProfilePage } from './components/PhotographerProfilePage';
import { StudioProfilePage } from './components/StudioProfilePage';
import { CheckoutPage } from './components/CheckoutPage';
import { Lock, LogIn, UserPlus } from 'lucide-react';
import { HomeView } from './components/HomeView';
import { ServiceLandingPage } from './components/ServiceLandingPage';
import { Toaster } from 'react-hot-toast';
import { landingPagesConfig } from './data/landingPagesConfig';
import { useTranslation } from 'react-i18next';
import { ScrollToTop } from './components/ScrollToTop';

const ProtectedViewWrapper = ({ children, tabName }) => {
  const { isAuthenticated, navigateToTab } = useApp();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return (
      <div className="py-24 px-4 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">{t('app.loginRequired')}</h2>
          <p className="text-slate-400 text-sm">
            {t('app.toView')} <span className="text-amber-400 font-bold capitalize">{tabName}</span> {t('app.loginDesc')}
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 pt-2">
          <button
            onClick={() => navigateToTab('login', null, { mode: 'login', redirectTab: tabName, actionPayload: null })}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-md transition"
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>{t('app.signIn')}</span>
          </button>

          <button
            onClick={() => navigateToTab('login', null, { mode: 'register', redirectTab: tabName, actionPayload: null })}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-xl shadow-amber-500/20 transition hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('app.createAccount')}</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const MainContent = () => {
  const { activeTab, currentUser, isAuthenticated } = useApp();

  return (
    <main className="min-h-screen bg-[#0b0e14]">
      {/* LANDING PAGE */}
      {activeTab === 'home' && (
        <HomeView />
      )}

      {/* DYNAMIC SERVICE LANDING PAGES */}
      {Object.keys(landingPagesConfig).includes(activeTab) && (
        <ServiceLandingPage serviceId={activeTab} />
      )}

      {/* PUBLIC DIRECTORY PAGES */}
      {activeTab === 'services' && (
        <ProtectedViewWrapper tabName="services">
          <ServicesSection />
        </ProtectedViewWrapper>
      )}

      {activeTab === 'photographers' && (
        <ProtectedViewWrapper tabName="photographers">
          <PhotographersDirectory />
        </ProtectedViewWrapper>
      )}

      {activeTab === 'packages' && (
        <ProtectedViewWrapper tabName="packages">
          <PackagesSection />
        </ProtectedViewWrapper>
      )}

      {activeTab === 'gallery' && (
        <ProtectedViewWrapper tabName="gallery">
          <GallerySection />
        </ProtectedViewWrapper>
      )}

      {activeTab === 'about' && (
        <ProtectedViewWrapper tabName="about">
          <AboutSection />
        </ProtectedViewWrapper>
      )}

      {activeTab === 'contact' && (
        <ProtectedViewWrapper tabName="contact">
          <ContactSection />
        </ProtectedViewWrapper>
      )}



      {/* NEW STANDALONE PAGES */}
      {activeTab === 'profile' && (
        <ProtectedViewWrapper tabName="photographer profile">
          <PhotographerProfilePage />
        </ProtectedViewWrapper>
      )}

      {activeTab === 'studioprofile' && (
        <ProtectedViewWrapper tabName="studio profile">
          <StudioProfilePage />
        </ProtectedViewWrapper>
      )}

      {activeTab === 'checkout' && (
        <ProtectedViewWrapper tabName="secure checkout">
          <CheckoutPage />
        </ProtectedViewWrapper>
      )}

      {activeTab === 'legal' && (
        <LegalPage />
      )}

      {activeTab === 'help' && (
        <HelpCenter />
      )}

      {activeTab === 'login' && !isAuthenticated && (
        <AuthPage />
      )}

      {/* PROTECTED CLIENT PAGES */}
      {![
        'home', 'services', 'photographers', 'packages', 'gallery', 
        'about', 'contact', 'dashboard', 'profile', 'studioprofile', 'checkout', 'legal', 'help', 'login',
        ...Object.keys(landingPagesConfig)
      ].includes(activeTab) && (
        <NotFoundPage />
      )}

      {/* Global Modals */}
      <PhotographerDetailModal />
      <BookingModal />
    </main>
  );
};

const AppLayout = () => {
  const { activeTab } = useApp();
  
  if (activeTab.includes('/')) {
    return (
      <>
        <PortalRouter />
        <PhotographerDetailModal />
        <BookingModal />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0b0e14]">
      <ScrollToTop />
      <Navbar />
      <MainContent />
      <Footer />
    </div>
  );
};

const ChatbotWrapper = () => {
  const { currentUser } = useApp();
  
  // Only show the chatbot if the user is explicitly a 'client'
  if (currentUser?.role === 'client') {
    return <ChatbotWidget />;
  }
  
  return null;
};

export default function App() {
  return (
    <AppProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #334155',
            borderRadius: '0.75rem',
            padding: '16px',
          },
          success: {
            iconTheme: { primary: '#f59e0b', secondary: '#0f172a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
          }
        }} 
      />
      <AppLayout />
      <ChatbotWrapper />
    </AppProvider>
  );
}
