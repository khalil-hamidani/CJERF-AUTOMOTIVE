import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { getCustomPartWhatsAppUrl } from '../config/contact';
import Logo3DFlying from './Logo3DFlying';
import WilayaDropdown from './WilayaDropdown';

export default function Configurator() {
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
    <section id="configurateur" className="py-16 sm:py-24 bg-cjerf-carbon border-t border-white/5 relative overflow-hidden">
      <div className="max-w-2xl mx-auto px-3.5 sm:px-6 relative z-10">
        
        {/* Flying 3D Logo (in place, slow hover, spring-back on release) */}
        <Logo3DFlying align="center" />

        <div className="text-center mb-6 sm:mb-10 -mt-1 sm:-mt-2">
          <h2 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            Pièce Sur-Mesure.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-light max-w-lg mx-auto">
            Une pièce cassée ou introuvable ? Décrivez votre besoin, notre atelier vous répond directement sur WhatsApp.
          </p>
        </div>

        {/* Taller, Sharper, Deep Technical Form (Focused width, impressive height) */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-950/90 border border-white/10 p-4 sm:p-8 md:p-10 rounded-2xl space-y-4 sm:space-y-5 shadow-2xl backdrop-blur-xl"
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

          {/* Row 4: Année */}
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
              Pièce recherchée ou à scanner en 3D *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Décrivez précisément votre pièce : emplacement (avant/arrière, gauche/droite), clips cassés, dimensions estimées, ou scan..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/70 border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-cjerf-red transition-all resize-y"
            />
          </div>

          {/* Row 6: Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 sm:py-4.5 rounded-xl bg-cjerf-red hover:bg-red-600 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2.5 transition-all shadow-xl shadow-cjerf-red/30 hover:shadow-cjerf-red/50 active:scale-[0.98] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Envoyer la demande sur WhatsApp</span>
          </button>
        </form>

      </div>
    </section>
  );
}
