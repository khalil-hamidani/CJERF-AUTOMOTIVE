import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, MapPin } from 'lucide-react';

export const WILAYAS_58 = [
  "16 - Alger", "31 - Oran", "25 - Constantine", "19 - Sétif", "09 - Blida", "35 - Boumerdès",
  "15 - Tizi Ouzou", "06 - Béjaïa", "13 - Tlemcen", "23 - Annaba", "34 - Bordj Bou Arreridj", "27 - Mostaganem",
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", "07 - Biskra",
  "08 - Béchar", "10 - Bouira", "11 - Tamanrasset", "12 - Tébessa", "14 - Tiaret", "17 - Djelfa",
  "18 - Jijel", "20 - Saïda", "21 - Skikda", "22 - Sidi Bel Abbès", "24 - Guelma", "26 - Médéa",
  "28 - M'Sila", "29 - Mascara", "30 - Ouargla", "32 - El Bayadh", "33 - Illizi", "36 - El Tarf",
  "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela", "41 - Souk Ahras", "42 - Tipaza",
  "43 - Mila", "44 - Aïn Defla", "45 - Naâma", "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane",
  "49 - Timimoun", "50 - Bordj Badji Mokhtar", "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah",
  "54 - In Guezzam", "55 - Touggourt", "56 - Djanet", "57 - El M'Ghair", "58 - El Meniaa"
];

export default function WilayaDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto focus search input when opened ONLY on desktop (prevents mobile keyboard from popping up and obstructing the list)
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined' && window.innerWidth >= 640) {
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 50);
      }
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const filteredWilayas = WILAYAS_58.filter((w) => {
    const cleanSearch = search.toLowerCase().trim();
    return w.toLowerCase().includes(cleanSearch);
  });

  const handleSelect = (wilaya) => {
    onChange(wilaya);
    setIsOpen(false);
  };

  const [code, name] = value.includes(' - ') ? value.split(' - ') : ['', value];

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* Trigger Button - Mobile touch friendly (16px base font prevents iOS auto-zoom) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-black/75 border rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-base sm:text-sm font-mono flex items-center justify-between transition-all duration-200 cursor-pointer text-left ${
          isOpen
            ? 'border-cjerf-red ring-1 ring-cjerf-red/40 shadow-lg shadow-cjerf-red/10'
            : 'border-white/10 hover:border-white/20 text-white'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2 sm:space-x-2.5 truncate">
          <MapPin className="w-4 h-4 text-cjerf-red shrink-0" />
          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] sm:text-[11px] font-bold text-zinc-300 font-mono shrink-0">
            {code}
          </span>
          <span className="text-white font-medium truncate text-xs sm:text-sm">{name}</span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-cjerf-red' : ''
          }`}
        />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-zinc-950/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Quick Search Bar - text-base on mobile prevents iOS viewport shift */}
          <div className="p-2 sm:p-2.5 border-b border-white/10 bg-black/60 sticky top-0 z-10">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher wilaya ou n° (ex: 16, Oran)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-base sm:text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cjerf-red transition-all"
              />
            </div>
          </div>

          {/* Wilaya Options List */}
          <div className="max-h-52 sm:max-h-60 overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
            {filteredWilayas.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-zinc-500">
                Aucune wilaya trouvée pour "{search}"
              </div>
            ) : (
              filteredWilayas.map((w) => {
                const [wCode, wName] = w.split(' - ');
                const isSelected = w === value;
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleSelect(w)}
                    className={`w-full px-3.5 sm:px-4 py-2.5 text-left text-xs font-mono flex items-center justify-between transition-colors cursor-pointer group active:bg-white/10 ${
                      isSelected
                        ? 'bg-cjerf-red/15 text-white font-bold'
                        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isSelected
                            ? 'bg-cjerf-red text-white'
                            : 'bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700'
                        }`}
                      >
                        {wCode}
                      </span>
                      <span className="tracking-wide text-xs sm:text-xs">{wName}</span>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-cjerf-red shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Footer Count */}
          <div className="px-3 py-1.5 border-t border-white/5 bg-black/40 text-[9px] sm:text-[10px] font-mono text-zinc-500 flex justify-between">
            <span>58 WILAYAS D'ALGÉRIE</span>
            <span>{filteredWilayas.length} disponibles</span>
          </div>

        </div>
      )}

    </div>
  );
}
