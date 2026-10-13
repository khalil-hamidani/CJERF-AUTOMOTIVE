import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, ShieldCheck, Sparkles, Truck, Ruler } from 'lucide-react';
import { getCustomPartWhatsAppUrl } from '../config/contact';
import Logo3DFlying from './Logo3DFlying';
import WilayaDropdown from './WilayaDropdown';

export default function CustomPartPage({ onBackToHome, onOpenCatalogue }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    wilaya: '16 - Alger',
    phone: '',
    make: '',
    model: '',
    year: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = getCustomPartWhatsAppUrl({
      firstName: formData.firstName,
      lastName: formData.lastName,
      wilaya: formData.wilaya,
      phone: formData.phone,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      partType: 'Pièce Sur-Mesure',
      description: formData.description,
      finish: 'Noir Texturé OEM',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-cjerf-black text-white pt-20 sm:pt-24 pb-16 sm:pb-24 relative overflow-x-hidden">
      
      {/* Ambient background glow - constrained to prevent mobile horizontal overflow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[700px] h-[200px] sm:h-[300px] bg-cjerf-red/10 blur-[100px] sm:blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-3xl mx-auto px-3.5 sm:px-6 relative z-10">
        
        {/* Navigation & Back Action */}
        <div className="flex items-center justify-between mb-4 sm:mb-8 pb-3 sm:pb-6 border-b border-white/5 gap-2">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 sm:space-x-2 text-zinc-400 hover:text-white font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cjerf-red" />
            <span>Retour</span>
            <span className="hidden xs:inline sm:inline"> à l'accueil</span>
          </button>

          {onOpenCatalogue && (
            <button
              onClick={onOpenCatalogue}
              className="text-[11px] sm:text-xs font-mono text-zinc-400 hover:text-cjerf-red transition-colors cursor-pointer py-1"
            >
              Consulter le Catalogue →
            </button>
          )}
        </div>

        {/* 3D Flying Logo placed on top */}
        <Logo3DFlying align="center" />

        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-10 -mt-1 sm:-mt-2">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 rounded-full bg-black/60 border border-cjerf-red/30 backdrop-blur-md mb-3 sm:mb-4 shadow-lg shadow-black/40">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cjerf-red animate-pulse" />
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider text-cjerf-red uppercase">
              <span className="hidden sm:inline">Atelier R&D // </span>Rétro-Ingénierie Automobile
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            Pièce Sur-Mesure.
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto leading-relaxed px-1 sm:px-0">
            Une pièce cassée, introuvable ou modifiée pour votre véhicule ? Décrivez votre besoin, notre atelier d'ingénierie vous répond directement sur WhatsApp avec faisabilité, modélisation CAO et devis.
          </p>
        </div>

        {/* Technical Form Card - Mobile padded & touch optimized */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-950/90 border border-white/10 p-4 sm:p-8 md:p-10 rounded-2xl space-y-4 sm:space-y-6 shadow-2xl backdrop-blur-xl"
        >
          {/* Row 1: Prénom & Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 sm:mb-2">
                Prénom *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Karim"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-black/70 border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cjerf-red transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 sm:mb-2">
                Nom *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Benali"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-black/70 border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cjerf-red transition-all"
              />
            </div>
          </div>

          {/* Row 2: Wilaya & Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 sm:mb-2">
                Wilaya *
              </label>
              <WilayaDropdown
                value={formData.wilaya}
                onChange={(val) => setFormData({ ...formData, wilaya: val })}
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 sm:mb-2">
                Téléphone (Optionnel)
              </label>
              <input
                type="tel"
                placeholder="Ex: 0550 12 34 56"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-black/70 border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cjerf-red transition-all"
              />
            </div>
          </div>

          {/* Row 3: Véhicule Marque & Modèle */}
          <div>
            <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 sm:mb-2">
              Véhicule (Marque & Modèle) *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Seat Ibiza 6J, Saxo VTS, Peugeot 208..."
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="w-full bg-black/70 border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cjerf-red transition-all"
            />
          </div>

          {/* Row 4: Année du Véhicule */}
          <div>
            <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 sm:mb-2">
              Année du Véhicule *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 2014"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full bg-black/70 border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cjerf-red transition-all"
            />
          </div>

          {/* Row 5: Pièce recherchée */}
          <div>
            <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 sm:mb-2">
              Description de la pièce recherchée *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Décrivez précisément votre pièce : emplacement (avant/arrière, gauche/droite), clips cassés, dimensions ou scan..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/70 border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cjerf-red transition-all resize-y"
            />
          </div>

          {/* Row 6: Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 sm:py-4 rounded-xl bg-cjerf-red hover:bg-red-600 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2.5 transition-all shadow-xl shadow-cjerf-red/30 hover:shadow-cjerf-red/50 active:scale-[0.98] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Envoyer la demande sur WhatsApp</span>
          </button>
        </form>

        {/* Technical Atelier Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex items-start space-x-3">
            <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-cjerf-red shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-xs font-bold text-white uppercase">Précision ±0.05 mm</div>
              <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">Ajustement millimétrique garanti identique à la pièce OEM.</div>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex items-start space-x-3">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cjerf-red shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-xs font-bold text-white uppercase">Haute Résistance</div>
              <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">Polymères techniques traités anti-UV et jusqu'à 110°C.</div>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex items-start space-x-3">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-cjerf-red shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-xs font-bold text-white uppercase">Livraison 58 Wilayas</div>
              <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">Expédition rapide à domicile ou en point relais.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
