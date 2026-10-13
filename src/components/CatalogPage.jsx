import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, ExternalLink, X, ZoomIn, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { getProductWhatsAppUrl, WHATSAPP_PHONE_NUMBER } from '../config/contact';

const CATALOG_ITEMS = [
  {
    id: 'ibiza-6j',
    brand: 'Seat',
    name: 'Cache Remorquage — Seat Ibiza 6J',
    years: '2008 – 2017',
    badge: 'Pièce Introuvable',
    image: '/assets/products/seat-ibiza-6j.jpg',
    material: 'PETG-CF / ABS Anti-UV (110°C)',
    description: 'Remplacement direct du cache remorquage avant. Nervures de clipsage renforcées contre les pertes sur nid-de-poule.',
    inStock: true,
  },
  {
    id: 'peugeot-107',
    brand: 'Peugeot',
    name: 'Cache Remorquage — Peugeot 107',
    years: '2005 – 2010',
    badge: 'Finition OEM',
    image: '/assets/products/peugeot-107.jpg',
    material: 'Polymère Noir Texturé Haute Densité',
    description: 'Profil incurvé épousant la découpe d’origine du pare-choc. Zéro vibration à haute vitesse.',
    inStock: true,
  },
  {
    id: 'aveo-ls',
    brand: 'Chevrolet',
    name: 'Paire Caches Inférieurs — Chevrolet Aveo LS',
    years: '2008 – 2013',
    badge: 'Kit Gauche + Droite',
    image: '/assets/products/aveo-ls.jpg',
    material: 'ABS Technique Renforcé',
    description: 'Paire complète pour la jupe avant inférieure. Résistant aux gravillons et aux déformations thermiques.',
    inStock: true,
  },
];

const BRANDS = ['Tous', 'Seat', 'Peugeot', 'Chevrolet'];

export default function CatalogPage({ onBackToHome, onOpenConfigurator }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tous');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    return CATALOG_ITEMS.filter((item) => {
      const matchesBrand = selectedBrand === 'Tous' || item.brand === selectedBrand;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.years.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });
  }, [searchQuery, selectedBrand]);

  return (
    <div className="min-h-screen bg-cjerf-black text-white pt-24 pb-20">
      
      {/* Background glow - constrained to prevent mobile horizontal scroll */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[700px] h-[200px] sm:h-[300px] bg-cjerf-red/5 blur-[100px] sm:blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1480px] mx-auto px-3.5 sm:px-6 md:px-8 relative z-10">
        
        {/* Navigation & Back Button - Mobile optimized with compact badges */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/5 gap-2">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer group py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cjerf-red group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
            <span className="hidden xs:inline sm:inline"> à l'accueil</span>
          </button>

          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[10px] sm:text-xs font-mono text-zinc-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Livraison 58 Wilayas</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-2.5 sm:px-3 py-1 rounded-full bg-cjerf-red/10 border border-cjerf-red/25 mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cjerf-red" />
            <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-cjerf-red uppercase">
              Catalogue Pièces Spécifiques
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight leading-tight">
            Catalogue de Pièces.
          </h1>

          <p className="mt-2.5 sm:mt-4 text-zinc-400 font-light text-xs sm:text-base leading-relaxed">
            Fabrication à la demande en polymères techniques automobiles. Commandez directement votre modèle sur WhatsApp ou demandez une personnalisation.
          </p>
        </div>

        {/* Search & Brand Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-white/5">
          
          {/* Search Input - text-base on mobile prevents iOS Safari auto-zoom */}
          <div className="relative flex-1 max-w-full md:max-w-md">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher modèle, pièce, marque..."
              className="w-full pl-10 sm:pl-11 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-zinc-900/60 border border-white/10 rounded-xl text-base sm:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cjerf-red/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Brand Filter Pills - Horizontally scrollable and swipeable on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1 sm:mx-0 sm:px-0">
            <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1 hidden sm:block shrink-0" />
            {BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border whitespace-nowrap shrink-0 active:scale-95 ${
                  selectedBrand === brand
                    ? 'bg-cjerf-red text-white border-cjerf-red font-semibold shadow-md shadow-cjerf-red/20'
                    : 'bg-zinc-900/40 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 sm:py-20 text-center rounded-2xl bg-zinc-900/20 border border-white/5 px-4">
            <p className="text-zinc-400 font-mono text-xs sm:text-sm">
              Aucune pièce trouvée pour "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('Tous');
              }}
              className="mt-4 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono uppercase transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => {
              const waUrl = getProductWhatsAppUrl(product.name, product.years);
              return (
                <div
                  key={product.id}
                  className="bg-zinc-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-cjerf-red/60 transition-all flex flex-col justify-between group backdrop-blur-sm"
                >
                  {/* Photo Stage */}
                  <div className="relative aspect-[4/3] bg-zinc-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden border-b border-white/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/75 border border-white/10 text-[10px] sm:text-[11px] font-mono text-zinc-300 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-cjerf-red" />
                      <span>{product.badge}</span>
                    </div>

                    {/* Zoom button */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 p-2 sm:p-2.5 bg-black/75 hover:bg-cjerf-red text-white rounded-xl backdrop-blur-md transition-colors cursor-pointer active:scale-95"
                      title="Agrandir"
                      aria-label="Agrandir l'image"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info & WhatsApp CTA */}
                  <div className="p-4 sm:p-6 flex flex-col justify-between flex-1 space-y-3 sm:space-y-4">
                    <div>
                      <div className="text-[11px] sm:text-xs font-mono text-zinc-400">
                        {product.years} • <span className="text-cjerf-red">{product.material}</span>
                      </div>
                      <h3 className="mt-1 font-display font-bold text-lg sm:text-xl text-white">
                        {product.name}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs text-zinc-400 font-light leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-1 sm:pt-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 rounded-xl bg-cjerf-red hover:bg-cjerf-red-dark text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-cjerf-red/20 hover:shadow-cjerf-red/35 active:scale-[0.98]"
                      >
                        <span>Commander sur WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Order Banner */}
        <div className="mt-10 sm:mt-16 p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-zinc-900/80 to-zinc-900/30 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase">
              Votre pièce ne figure pas encore au catalogue ?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Nous concevons et imprimons n'importe quelle pièce introuvable à partir d'un échantillon ou d'un scan 3D.
            </p>
          </div>

          <button
            onClick={onOpenConfigurator}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shrink-0 cursor-pointer border border-white/10 text-center active:scale-[0.98]"
          >
            Lancer une demande sur-mesure
          </button>
        </div>

      </div>

      {/* Fullscreen Photo Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <h3 className="font-display font-bold text-base sm:text-lg text-white truncate pr-2">
                {selectedProduct.name}
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-zinc-400 hover:text-white cursor-pointer p-1 -mr-1"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[4/3] bg-zinc-950 rounded-xl flex items-center justify-center p-3 sm:p-4 min-h-0 flex-1 overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <a
              href={getProductWhatsAppUrl(selectedProduct.name, selectedProduct.years)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 bg-cjerf-red hover:bg-cjerf-red-dark text-white font-mono text-xs font-bold uppercase text-center rounded-xl transition-all shrink-0 active:scale-[0.98]"
            >
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
