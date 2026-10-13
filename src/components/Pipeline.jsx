import React, { useState } from 'react';
import { Scan, Box, Layers, CheckCircle2, ChevronRight, ShieldAlert, Cpu } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Pipeline() {
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Scan 3D & Relevé de Cotes',
      subtitle: 'Numérisation haute précision de l’emplacement exact sur le véhicule',
      description: 'À l’aide de palpeurs optiques et de scans dimensionnels au laser bleu, nous capturons l’empreinte millimétrique du pare-choc ou de la carrosserie hôte. Aucune approximation : la courbure et les contraintes d’alignement sont relevées avec une tolérance stricte de ±0.05 mm.',
      specs: [
        { label: 'Précision de numérisation', val: '0.04 mm / point' },
        { label: 'Matrice de capture', val: 'Nuage de points 3D haute densité' },
        { label: 'Support véhicule', val: 'Tout constructeur (Seat, Peugeot, Chevy...)' },
      ],
      icon: Scan,
      visualTag: 'METROLOGY PROTOCOL',
    },
    {
      num: '02',
      title: 'Conception Paramétrique & Renforts',
      subtitle: 'Redesign ingénierie et élimination des faiblesses d’origine',
      description: 'Les clips d’origine constructeur cassent souvent à cause de concentrations de contraintes trop aiguës. Sur nos stations de CAO paramétrique, nous épaississons les nervures d’ancrage, ajoutons des congés de raccordement et optimisons la géométrie pour encaisser les déformations sans rupture.',
      specs: [
        { label: 'Optimisation mécanique', val: '+300% résistance aux clips' },
        { label: 'Logiciel', val: 'Conception Solide Paramétrique CAO' },
        { label: 'Contrôle jeu', val: 'Zero-Gap Carrosserie' },
      ],
      icon: Box,
      visualTag: 'STRESS FEA SIMULATION',
    },
    {
      num: '03',
      title: 'Impression Additive Haute Performance',
      subtitle: 'Polymères techniques industriels PETG-Carbone & ABS technique',
      description: 'Pas de plastique PLA fragile de loisir : nous extrudons exclusivement des polymères techniques qualifiés automobile. Le PETG chargé en microfibres de carbone et l’ABS haute température résistent aux rayons UV du climat algérien, aux hydrocarbures, et ne se déforment pas sous 110°C.',
      specs: [
        { label: 'Matériaux', val: 'PETG-CF / ABS / ASA Anti-UV' },
        { label: 'Résistance thermique', val: '110°C continu en baie moteur' },
        { label: 'Adhérence inter-couches', val: 'Fusion isotrope optimisée' },
      ],
      icon: Layers,
      visualTag: 'FDM ADDITIVE PRODUCTION',
    },
    {
      num: '04',
      title: 'Ajustement Zéro-Défaut & Finition',
      subtitle: 'Contrôle qualité atelier, finition noire texturée ou prête à peindre',
      description: 'Chaque pièce sortant de nos imprimantes subit un gabarit de contrôle d’ajustement réel. La finition satinée ou texturée noire s’intègre directement à vos plastiques d’origine sans besoin de mise en peinture, ou peut recevoir un apprêt carrossier.',
      specs: [
        { label: 'Finition standard', val: 'Noir Carrosserie Texturé OEM' },
        { label: 'Option peinture', val: 'Surface compatible apprêt & laque' },
        { label: 'Garantie atelier', val: 'Ajustement direct "Plug & Clip"' },
      ],
      icon: CheckCircle2,
      visualTag: 'ZERO-DEFECT QC LAB',
    },
  ];

  const currentStep = steps[activeTab];
  const CurrentIcon = currentStep.icon;

  return (
    <section id="pipeline" className="py-24 bg-cjerf-carbon relative border-t border-cjerf-border/60 overflow-hidden">
      
      {/* Background technical accent glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cjerf-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cjerf-surface border border-cjerf-border font-mono text-xs text-cjerf-red uppercase mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>MÉTHODOLOGIE ATELIER // 4 ÉTAPES</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
            Le Pipeline de Précision.
          </h2>

          <p className="mt-4 text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
            De la pièce manquante introuvable en concession à la pièce montée sur votre pare-choc : découvrez notre protocole d’ingénierie inverse rigoureux.
          </p>
        </div>

        {/* Step Selector Tabs (Awwwards segmented control) */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((s, index) => {
            const isSelected = activeTab === index;
            const Icon = s.icon;
            return (
              <button
                key={s.num}
                onClick={() => {
                  sound.playMechanicalClick();
                  setActiveTab(index);
                }}
                className={`text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-cjerf-surface border-cjerf-red shadow-red-subtle'
                    : 'bg-cjerf-black/60 border-cjerf-border hover:border-cjerf-border-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${isSelected ? 'text-cjerf-red' : 'text-zinc-500'}`}>
                    ÉTAPE {s.num}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cjerf-red' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                </div>
                <div className={`mt-2 font-display text-sm sm:text-base font-bold ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                  {s.title.split('&')[0]}
                </div>
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-cjerf-red" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Card */}
        <div className="mt-8 bg-cjerf-surface/90 border border-cjerf-border rounded-2xl p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-3xl font-black text-cjerf-red">
                  {currentStep.num}.
                </span>
                <span className="px-3 py-1 bg-cjerf-black rounded border border-cjerf-border font-mono text-xs text-zinc-400">
                  {currentStep.visualTag}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase">
                {currentStep.title}
              </h3>

              <p className="text-zinc-300 font-medium text-sm sm:text-base">
                {currentStep.subtitle}
              </p>

              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                {currentStep.description}
              </p>

              {/* Technical Specifications Matrix */}
              <div className="pt-4 border-t border-cjerf-border/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentStep.specs.map((item, idx) => (
                  <div key={idx} className="bg-cjerf-black/60 p-3 rounded-lg border border-cjerf-border/60">
                    <div className="font-mono text-[10px] text-zinc-500 uppercase">{item.label}</div>
                    <div className="font-mono text-xs font-bold text-white mt-1">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Telemetry Visual Block (5 cols) */}
            <div className="lg:col-span-5 bg-cjerf-black rounded-xl p-6 border border-cjerf-border relative overflow-hidden font-mono text-xs">
              
              <div className="flex items-center justify-between pb-3 border-b border-cjerf-border text-zinc-400">
                <span className="flex items-center space-x-2">
                  <CurrentIcon className="w-4 h-4 text-cjerf-red" />
                  <span>CAD_CORE_LOG // 0{activeTab + 1}</span>
                </span>
                <span className="text-emerald-400">STATUS : VALIDÉ</span>
              </div>

              <div className="py-6 space-y-3 text-zinc-300">
                <div className="flex justify-between border-b border-cjerf-border/40 pb-1.5">
                  <span className="text-zinc-500">TOLÉRANCE MAX</span>
                  <span className="text-white font-bold">± 0.05 mm</span>
                </div>
                <div className="flex justify-between border-b border-cjerf-border/40 pb-1.5">
                  <span className="text-zinc-500">TEMPERATURE CLIMAT</span>
                  <span className="text-white font-bold">-10°C à +110°C</span>
                </div>
                <div className="flex justify-between border-b border-cjerf-border/40 pb-1.5">
                  <span className="text-zinc-500">INDICE UV ALGÉRIE</span>
                  <span className="text-emerald-400 font-bold">CERTIFIÉ GRADE EXCLUSIF</span>
                </div>
                <div className="flex justify-between border-b border-cjerf-border/40 pb-1.5">
                  <span className="text-zinc-500">ORIGINE FABRICATION</span>
                  <span className="text-cjerf-red font-bold">100% ATELIER ALGER 🇩🇿</span>
                </div>
              </div>

              <div className="pt-3 border-t border-cjerf-border flex items-center justify-between text-[11px] text-zinc-500">
                <span>INSPECTION PHYSIQUE GABARIT</span>
                <span className="text-white font-bold">100% CONTRÔLÉ</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
