import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { WHATSAPP_PHONE_NUMBER } from '../config/contact';

export default function Header({ currentView, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (target === 'catalogue') {
      if (onNavigate) onNavigate('catalogue');
      window.location.hash = '/catalogue';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'sur-mesure' || target === 'configurateur') {
      if (onNavigate) onNavigate('sur-mesure');
      window.location.hash = '/sur-mesure';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (currentView !== 'home' && onNavigate) {
        onNavigate('home');
      }
      window.location.hash = '';
      if (target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-cjerf-black/75 backdrop-blur-md border-b border-white/5 py-4 transition-all">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="flex items-center cursor-pointer"
        >
          <img
            src="/assets/cjerf-logo-dark.png"
            alt="CJERF Automotive"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </a>

        {/* Minimal Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-widest uppercase">
          <button
            onClick={(e) => handleLinkClick(e, 'catalogue')}
            className={`transition-colors cursor-pointer ${
              currentView === 'catalogue' ? 'text-cjerf-red font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Catalogue
          </button>
          <a
            href="#fabrication"
            onClick={(e) => handleLinkClick(e, 'fabrication')}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Fabrication
          </a>
          <a
            href="#avis"
            onClick={(e) => handleLinkClick(e, 'avis')}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Avis
          </a>
          <button
            onClick={(e) => handleLinkClick(e, 'sur-mesure')}
            className={`transition-colors cursor-pointer ${
              currentView === 'sur-mesure' ? 'text-cjerf-red font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sur-Mesure
          </button>
        </nav>

        {/* Minimal WhatsApp Button */}
        <div className="hidden sm:flex items-center">
          <a
            href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Bonjour CJERF Automotive, je souhaite me renseigner sur vos pièces.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-cjerf-red hover:bg-cjerf-red-dark text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200"
          >
            WhatsApp
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-white p-1 cursor-pointer"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cjerf-black/95 border-b border-white/10 px-6 py-6 space-y-4">
          <button
            onClick={(e) => handleLinkClick(e, 'catalogue')}
            className={`block text-left w-full text-sm font-mono ${
              currentView === 'catalogue' ? 'text-cjerf-red font-bold' : 'text-zinc-300 hover:text-white'
            }`}
          >
            Catalogue
          </button>
          <a
            href="#fabrication"
            onClick={(e) => handleLinkClick(e, 'fabrication')}
            className="block text-sm font-mono text-zinc-300 hover:text-white"
          >
            Fabrication
          </a>
          <a
            href="#avis"
            onClick={(e) => handleLinkClick(e, 'avis')}
            className="block text-sm font-mono text-zinc-300 hover:text-white"
          >
            Avis
          </a>
          <button
            onClick={(e) => handleLinkClick(e, 'sur-mesure')}
            className={`block text-left w-full text-sm font-mono ${
              currentView === 'sur-mesure' ? 'text-cjerf-red font-bold' : 'text-zinc-300 hover:text-white'
            }`}
          >
            Sur-Mesure
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Bonjour CJERF Automotive, je souhaite commander.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2.5 bg-cjerf-red text-white font-mono text-xs font-bold rounded-lg uppercase"
          >
            WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
