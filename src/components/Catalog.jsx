import React, { useState } from 'react';
import { ExternalLink, X, ZoomIn } from 'lucide-react';
import { getProductWhatsAppUrl } from '../config/contact';

export default function Catalog() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 'ibiza-6j',
      name: 'Cache Remorquage — Seat Ibiza 6J',
      years: '2008 – 2017',
      image: '/assets/products/seat-ibiza-6j.jpg',
      material: 'PETG-CF / ABS Anti-UV (110°C)',
    },
    {
      id: 'peugeot-107',
      name: 'Cache Remorquage — Peugeot 107',
      years: '2005 – 2010',
      image: '/assets/products/peugeot-107.jpg',
      material: 'Polymère Noir Texturé OEM',
    },
    {
      id: 'aveo-ls',
      name: 'Paire Caches Inférieurs — Chevrolet Aveo LS',
      years: '2008 – 2013',
      image: '/assets/products/aveo-ls.jpg',
      material: 'Kit Gauche + Droite Renforcé',
    },
    {
      id: 'm-style-mirror',
      name: 'Coque Rétroviseur Aérodynamique M-Style',
      years: 'Bespoke / Multi-modèles',
      image: '/assets/products/mirror-cap-3d.jpg',
      material: 'PETG Fibre de Carbone Brut',
    },
  ];

  return (
    <section id="catalogue" className="py-20 bg-cjerf-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Minimal Section Title */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase">
            Catalogue de Pièces.
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-light">
            Fabrication à la demande • Commande directe sur WhatsApp
          </p>
        </div>

        {/* Clean 4-Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {products.map((product) => {
            const waUrl = getProductWhatsAppUrl(product.name, product.years);
            return (
              <div
                key={product.id}
                className="bg-cjerf-surface/60 border border-white/10 rounded-2xl overflow-hidden hover:border-cjerf-red/60 transition-all flex flex-col justify-between group"
              >
                {/* Photo Stage */}
                <div className="relative aspect-[4/3] bg-cjerf-card flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute bottom-3 right-3 p-2 bg-black/70 hover:bg-cjerf-red text-white rounded-lg backdrop-blur-md transition-colors"
                    title="Agrandir"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Info & Button */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <div className="text-xs font-mono text-zinc-400">
                      {product.years} • {product.material}
                    </div>
                    <h3 className="mt-1 font-display font-bold text-xl text-white">
                      {product.name}
                    </h3>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-cjerf-red hover:bg-cjerf-red-dark text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>Commander sur WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Clean Fullscreen Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-cjerf-surface border border-white/10 rounded-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">
                {selectedProduct.name}
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[4/3] bg-cjerf-card rounded-xl flex items-center justify-center p-4">
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
              className="block w-full py-3 bg-cjerf-red hover:bg-cjerf-red-dark text-white font-mono text-xs font-bold uppercase text-center rounded-xl"
            >
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
