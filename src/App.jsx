import React, { useState, useEffect, Suspense, lazy } from 'react';
import HudCursor from './components/HudCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsShowcase from './components/StatsShowcase';
import PrinterCarVideo from './components/PrinterCarVideo';
import ClientReviews from './components/ClientReviews';
import LoadingOverlay from './components/preloader/LoadingOverlay';
import Footer from './components/Footer';

const CatalogPage = lazy(() => import('./components/CatalogPage'));
const CustomPartPage = lazy(() => import('./components/CustomPartPage'));

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/catalogue' || hash === '#catalogue') return 'catalogue';
    if (hash === '#/sur-mesure' || hash === '#sur-mesure' || hash === '#/configurateur' || hash === '#configurateur') {
      return 'sur-mesure';
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/catalogue' || hash === '#catalogue') {
        setCurrentView('catalogue');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (
        hash === '#/sur-mesure' ||
        hash === '#sur-mesure' ||
        hash === '#/configurateur' ||
        hash === '#configurateur'
      ) {
        setCurrentView('sur-mesure');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenCatalogue = () => {
    setCurrentView('catalogue');
    window.location.hash = '/catalogue';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCustomPart = () => {
    setCurrentView('sur-mesure');
    window.location.hash = '/sur-mesure';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view) => {
    if (view === 'catalogue') {
      handleOpenCatalogue();
    } else if (view === 'sur-mesure' || view === 'configurateur') {
      handleOpenCustomPart();
    } else {
      handleBackToHome();
    }
  };

  return (
    <div className="min-h-screen bg-cjerf-black text-cjerf-white relative selection:bg-cjerf-red selection:text-white">
      {/* Premium 3D Asset Preloader with Progressive 70% Reveal */}
      <LoadingOverlay />

      {/* Minimalist HUD cursor */}
      <HudCursor />

      {/* Persistent Header */}
      <Header currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Experience Router */}
      <main>
        {currentView === 'catalogue' ? (
          /* ========================================================= */
          /* DEDICATED CATALOGUE PAGE (Code-split)                     */
          /* ========================================================= */
          <Suspense
            fallback={
              <div className="min-h-screen bg-cjerf-black flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-cjerf-red border-t-transparent animate-spin" />
              </div>
            }
          >
            <CatalogPage
              onBackToHome={handleBackToHome}
              onOpenConfigurator={handleOpenCustomPart}
            />
          </Suspense>
        ) : currentView === 'sur-mesure' ? (
          /* ========================================================= */
          /* DEDICATED PIÈCE SUR-MESURE PAGE (Code-split)              */
          /* ========================================================= */
          <Suspense
            fallback={
              <div className="min-h-screen bg-cjerf-black flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-cjerf-red border-t-transparent animate-spin" />
              </div>
            }
          >
            <CustomPartPage
              onBackToHome={handleBackToHome}
              onOpenCatalogue={handleOpenCatalogue}
            />
          </Suspense>
        ) : (
          /* ========================================================= */
          /* INDEX / HOME EXPERIENCE FLOW                             */
          /* 1. Hero Cinematic Video                                   */
          /* 2. Stats Showcase (Counters + 3D CAD Models)              */
          /* 3. Fabrication Video ("Du Filament au Pare-Choc") + CTA  */
          /* 4. Client Reviews (Verified 58 Wilayas)                   */
          /* ========================================================= */
          <>
            {/* 1. Hero with prominent video background and punchy text */}
            <Hero />

            {/* 2. Stats & CAD 3D Models Inspection */}
            <StatsShowcase />

            {/* 3. Full Video: 3D Printer to Car + "Voir le Catalogue" button */}
            <PrinterCarVideo onOpenCatalogue={handleOpenCatalogue} />

            {/* 4. Verified Client & Garage Reviews */}
            <ClientReviews />
          </>
        )}
      </main>

      {/* Rich Footer with Instagram, TikTok, navigation & Khalil Hamidani credit */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
