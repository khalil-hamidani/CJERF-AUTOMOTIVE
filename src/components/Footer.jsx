import React from 'react';
import { Mail, MessageCircle, Instagram, ExternalLink, ArrowUpRight } from 'lucide-react';
import { WHATSAPP_PHONE_NUMBER, CONTACT_INFO } from '../config/contact';

function TikTokIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.86-4.49V8.52a8.27 8.27 0 0 0 4.84 1.56V6.69h-.93z" />
    </svg>
  );
}

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-cjerf-black border-t border-white/10 pt-16 pb-12 text-zinc-400 font-mono text-xs">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/5">
          
          {/* Column 1: Brand & Atelier */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/cjerf-logo-dark.png"
                alt="CJERF Automotive"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-zinc-400 text-xs font-light leading-relaxed font-sans">
              Atelier d’ingénierie et de fabrication additive automobile. Remplacement et renforcement de pièces de carrosserie introuvables.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[11px] text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Alger, Algérie 🇩🇿 • 58 Wilayas</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-[11px]">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Accueil</span>
                </a>
              </li>
              <li>
                <a
                  href="#/catalogue"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('catalogue');
                    }
                  }}
                  className="hover:text-cjerf-red transition-colors flex items-center space-x-1 text-zinc-200"
                >
                  <span>Catalogue des Pièces</span>
                  <ArrowUpRight className="w-3 h-3 text-cjerf-red" />
                </a>
              </li>
              <li>
                <a href="#metriques" className="hover:text-white transition-colors">
                  Métriques & Inspection 3D
                </a>
              </li>
              <li>
                <a href="#fabrication" className="hover:text-white transition-colors">
                  Processus Additif
                </a>
              </li>
              <li>
                <a href="#avis" className="hover:text-white transition-colors">
                  Avis Clients Vérifiés
                </a>
              </li>
              <li>
                <a
                  href="#/sur-mesure"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('sur-mesure');
                    }
                  }}
                  className="hover:text-cjerf-red transition-colors"
                >
                  Pièce Sur-Mesure
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Réseaux Sociaux & Contact */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-[11px]">
              Réseaux & Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={CONTACT_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-colors flex items-center space-x-2 text-zinc-300 group"
                >
                  <Instagram className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span>Instagram</span>
                  <span className="text-[10px] text-zinc-500">@cjerfautomotive_</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_INFO.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center space-x-2 text-zinc-300 group"
                >
                  <TikTokIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>TikTok</span>
                  <span className="text-[10px] text-zinc-500">@cjerfautomotive</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('Bonjour CJERF Automotive')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-2 text-zinc-300 group"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>WhatsApp Direct</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-white transition-colors flex items-center space-x-2 text-zinc-300 group"
                >
                  <Mail className="w-4 h-4 text-cjerf-red group-hover:scale-110 transition-transform" />
                  <span className="truncate">{CONTACT_INFO.email}</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Prominent Developer Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-xs text-zinc-500 font-mono">
            © {new Date().getFullYear()} CJERF AUTOMOTIVE. Tous droits réservés.
          </div>

          {/* Prominent Developer Credit requested by user */}
          <div className="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-cjerf-red/60 transition-all shadow-lg group">
            <span className="text-xs sm:text-sm text-zinc-300 font-mono">
              Site développé par
            </span>
            <a
              href="https://khalilhamidani.engineer/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm sm:text-base font-bold text-white group-hover:text-cjerf-red transition-colors inline-flex items-center space-x-1 tracking-wide"
            >
              <span className="underline decoration-cjerf-red decoration-2 underline-offset-4">
                Khalil Hamidani
              </span>
              <ExternalLink className="w-4 h-4 ml-1 text-cjerf-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
