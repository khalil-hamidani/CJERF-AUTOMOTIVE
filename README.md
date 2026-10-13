# 🏎️ CJERF AUTOMOTIVE — Ingénierie Inverse & Fabrication Additive

> **Atelier algérien de rétro-ingénierie et de fabrication additive automobile de précision.**  
> Reproduction, conception CAO et fabrication de pièces de carrosserie introuvables ou discontinues (caches remorquage, boucliers, coques rétroviseurs, bagues capteurs) avec une tolérance OEM de **±0.05 mm** et des polymères techniques haute température (PETG-CF Carbone 110°C, ABS Technique, ASA Anti-UV).

---

## 🌟 Fonctionnalités Clés du Site Web

### 1. 🔍 Banc d'Inspection CAO & Visualiseur 3D Haute Précision
- **Cotations CAO Dynamiques 1:1** : Calcul mathématique en temps réel des dimensions physiques (Largeur, Hauteur, Profondeur en millimètres) directement extraites des sommets des modèles 3D (`.glb`).
- **Bascule Solide / Cotations** : Commutateur interactif permettant de passer d'un affichage plein à une vue métrologique avec lignes de rappel, ticks techniques et table de référence marbre CMM.
- **Performances & Économie d'Énergie** : Suspension automatique de la boucle de rendu WebGL via `IntersectionObserver` lorsque la section n'est pas dans le champ de vision.
- **Libération Mémoire & Zéro Fuite** : Gestion stricte des contextes WebGL avec perte de contexte forcée (`forceContextLoss`) et nettoyage récursif des géométries/matériaux pour garantir la stabilité sur smartphones et appareils modestes.

### 2. 🎬 Hero Vidéo Cinématique & Identité Motorsport
- **Stream Vidéo Adaptatif** : Détection dynamique de l'appareil (Mobile vs Desktop) pour charger uniquement la vidéo appropriée, évitant le gaspillage de bande passante cellulaire.
- **Logo 3D Flottant & Interactif** : Rendu Three.js avec physique d'amortissement et rappel élastique au glissement tactile ou à la souris.

### 3. ⚙️ Animation Scroller "Du Filament au Pare-Choc"
- **Scrubber Canvas 108 Frames** : Défilement synchronisé ultra-fluide avec interpolation (lerp) sur Desktop.
- **Chargement Étagé (Staged Keyframes)** : Chargement prioritaire des images clés pour une réactivité immédiate sans saturer la bande passante, complété en temps masqué (`requestIdleCallback`).
- **Expérience Mobile Dédiée** : Vidéo compacte optimisée avec vignette cinématique pour une lisibilité parfaite.

### 4. 🛠️ Configurateur & Devis Pièce Sur-Mesure
- Formulaire technique complet (Marque, Modèle, Année, Type de pièce, Description).
- **Sélecteur Moderne des 58 Wilayas d'Algérie** avec recherche rapide et support tactile optimisé.
- Génération instantanée du message WhatsApp technique pré-formaté et redirection directe vers l'atelier (`+213 777 50 30 18`).

### 5. 📦 Catalogue Technique & Avis Vérifiés
- Catalogue interactif avec filtres par marque (Seat, Peugeot, Chevrolet...) et recherche textuelle instantanée.
- Fiches détaillées avec matériaux recommandés et liens de commande express.
- Section **Retours d'Atelier** avec carrousel 3D incliné (tilt spring), support des gestes tactiles (swipe) et rotation automatique.

---

## 🚀 Optimisations & Bonnes Pratiques

- **Code Splitting (Vite & Rollup)** : Découpage intelligent du bundle applicatif. Les pages `CatalogPage` et `CustomPartPage` sont chargées à la demande avec `React.lazy` et `Suspense`. Le bundle principal est allégé à ~80 Ko gzippé.
- **Vendor Chunking** : Isolation des librairies tierces (`three`, `lucide-react`, `framer-motion`) dans des fichiers mis en cache à long terme.
- **Ratio de Pixels Adaptatif (DPR)** : Clamping du DPR à 1.5 sur smartphone pour réduire de 75% la charge de calcul GPU sans aucune perte de qualité visible.
- **Curseur HUD Zéro Re-Render** : Manipulation directe des styles CSS en mémoire pour éliminer les re-renders inutiles de React au déplacement de la souris.

---

## 🛠️ Stack Technique

- **Framework** : [React 18](https://react.dev/)
- **Build Tool** : [Vite 6](https://vitejs.dev/)
- **3D & Métrologie** : [Three.js](https://threejs.org/) (GLTFLoader, OrbitControls)
- **Styling** : [Tailwind CSS 3](https://tailwindcss.com/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Icônes** : [Lucide React](https://lucide.dev/)

---

## 💻 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- `npm` ou `yarn` / `pnpm`

### Installation

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/khalil-hamidani/CJERF-AUTOMOTIVE.git
   cd CJERF-AUTOMOTIVE
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`.

4. **Compiler pour la production :**
   ```bash
   npm run build
   ```

5. **Tester la version compilée en local :**
   ```bash
   npm run preview
   ```

---

## 📁 Structure du Projet

```text
cjerf_automotive/
├── public/
│   ├── assets/
│   │   ├── models/           # Modèles 3D GLB (cache-107, aveo, obus-saxo, support-radar)
│   │   ├── products/         # Photos et rendus des pièces du catalogue
│   │   ├── scroll-frames/    # 108 frames WebP pour le scroll scrubber
│   │   ├── hero-cinematic.mp4
│   │   ├── hero-mobile.mp4
│   │   ├── fabrication-mobile.mp4
│   │   └── cjerf-logo-dark.png
│   └── cjerf-3d-logo-white.glb
├── src/
│   ├── components/
│   │   ├── preloader/        # Préchargeur optimisé & overlay d'initialisation
│   │   ├── CatalogPage.jsx   # Page catalogue complète (code-split)
│   │   ├── CustomPartPage.jsx# Page commande sur-mesure (code-split)
│   │   ├── Header.jsx        # Barre de navigation responsive
│   │   ├── Hero.jsx          # Hero cinématique avec sélection de stream
│   │   ├── HudCursor.jsx     # Curseur HUD léger (0 re-render)
│   │   ├── Logo3DFlying.jsx  # Logo 3D interactif Three.js
│   │   ├── ModelViewer3D.jsx # Banc d'inspection 3D avec cotations CAO 1:1
│   │   ├── PrinterCarVideo.jsx# Scrubber canvas 108 frames & vidéo mobile
│   │   ├── StatsShowcase.jsx # Métriques et compteurs animés
│   │   ├── ClientReviews.jsx # Témoignages et avis 58 wilayas
│   │   ├── WilayaDropdown.jsx# Sélecteur des 58 Wilayas d'Algérie
│   │   └── Footer.jsx        # Pied de page avec réseaux et crédits
│   ├── config/
│   │   └── contact.js        # Coordonnées atelier & générateurs WhatsApp
│   ├── hooks/
│   │   └── useAssetLoader.js # Hook React pour la progression des assets
│   ├── utils/
│   │   └── AssetLoadingManager.js # Gestionnaire de préchargement
│   ├── App.jsx               # Routeur et orchestration de l'application
│   ├── index.css             # Directives Tailwind et typographies
│   └── main.jsx              # Point d'entrée React
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js            # Configuration des chunks Rollup
```

---

## 📞 Contact Atelier

- **Atelier** : CJERF Automotive
- **Localisation** : Alger, Algérie 🇩🇿 (Livraison 58 Wilayas)
- **WhatsApp** : [+213 777 50 30 18](https://wa.me/213777503018)
- **Instagram** : [@cjerfautomotive_](https://www.instagram.com/cjerfautomotive_/)
- **Développement** : Khalil Hamidani
