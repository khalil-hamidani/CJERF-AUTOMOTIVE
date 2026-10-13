<div align="center">

# 🏎️ CJERF AUTOMOTIVE
### Ingénierie Inverse & Fabrication Additive Automobile de Haute Précision

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Deployment](https://img.shields.io/badge/Deploy-cjerf--automotive.vercel.app-success?style=for-the-badge&logo=vercel&logoColor=white)
![Territoire](https://img.shields.io/badge/Livraison-58%20Wilayas%20🇩🇿-E10600?style=for-the-badge)

<br/>

<p align="center">
  <strong>🌐 Site Officiel & Démo Live : <a href="https://cjerf-automotive.vercel.app" target="_blank">cjerf-automotive.vercel.app</a></strong><br/>
  <em>Miroir alternatif : <a href="https://cjerfautomotive.vercel.app" target="_blank">cjerfautomotive.vercel.app</a></em>
</p>

<p align="center">
  <strong>Atelier algérien spécialisé dans la rétro-ingénierie, la modélisation CAO et la reproduction de pièces de carrosserie introuvables.</strong><br/>
  Caches remorquage, écopes d'air, coques de rétroviseurs, bagues de capteurs radar conçus avec une tolérance OEM <strong>±0.05 mm</strong> et imprimés en polymères techniques haute performance (PETG-CF Carbone 110°C, ABS Technique, ASA Anti-UV).
</p>

[🌐 Démo en Ligne](https://cjerf-automotive.vercel.app) • [Explorer le Catalogue](https://github.com/khalil-hamidani/CJERF-AUTOMOTIVE#-catalogue-technique--avis-clients) • [Banc d'Inspection 3D](https://github.com/khalil-hamidani/CJERF-AUTOMOTIVE#-banc-dinspection-cao--visualiseur-3d) • [Démarrage Rapide](https://github.com/khalil-hamidani/CJERF-AUTOMOTIVE#-démarrage-rapide) • [Déploiement](https://github.com/khalil-hamidani/CJERF-AUTOMOTIVE#-guide-de-déploiement)

</div>

---

## 🌟 Fonctionnalités & Expérience Utilisateur

### 📐 Banc d'Inspection CAO & Visualiseur 3D
- **Cotations CAO Dynamiques 1:1** : Mesures en temps réel (Largeur, Hauteur, Profondeur en millimètres) calculées mathématiquement à partir des sommets géométriques des fichiers GLB d'origine (`THREE.Box3`).
- **Mode Métrologique & Commutateur SOLIDE / COTATIONS** :
  - **Vue Solide** : Rendu matériau polymère technique avec éclairage studio studio key/fill et reflets rouges motorsport.
  - **Vue Cotations** : Lignes de cote techniques rouges fines, flèches/ticks à 45°, lignes d'attache d'extension, table de référence marbre CMM et étiquettes 2D projetées à 60–120 FPS.
- **Suspension GPU Intelligente (`IntersectionObserver`)** :
  - La boucle d'animation Three.js (`requestAnimationFrame`) se coupe automatiquement lorsque la section quitte le viewport. La consommation GPU et batterie tombe à 0% en dehors de la zone d'inspection.
- **Zéro Fuite Mémoire & Clamping DPR** :
  - Nettoyage récursif des géométries/matériaux et appel explicite à `renderer.forceContextLoss()`.
  - Device Pixel Ratio bridé à 1.5 sur smartphone pour éliminer les surchauffes et préserver la batterie.

### 🎬 Hero Cinématique & Stream Vidéo Adaptatif
- **Zéro Gaspillage de Données Mobiles** : Détection dynamique de l'affichage pour n'injecter qu'un seul flux vidéo dans le DOM (`hero-mobile.mp4` sur smartphone, `hero-cinematic.mp4` sur desktop). Économie directe de 12 à 15 Mo de transfert réseau.
- **Logo 3D Flottant avec Physique Tactile** : Modèle 3D CJERF avec inertie et rappel élastique (spring physics) au glissement souris / doigt.

### ⚙️ Scrubber Vidéo "Du Filament au Pare-Choc"
- **Scrubber Canvas 108 Frames (Desktop)** : Défilement synchronisé ultra-fluide au scroll de la souris.
- **Chargement Étagé par Keyframes (Staged Loading)** :
  1. Affichage immédiat de la première frame (0 ms).
  2. Préchargement prioritaire des keyframes (1 image sur 3) pour un scroll utilisable immédiatement.
  3. Téléchargement progressif des frames intermédiaires en temps masqué (`requestIdleCallback`).
- **Isolation Stricte Mobile** : Les 108 images sont totalement désactivées sur mobile au profit d'une vidéo verticale optimisée.

### 🛠️ Formulaire Pièce Sur-Mesure & Devis WhatsApp
- **Sélecteur Moderne des 58 Wilayas d'Algérie** : Interface personnalisée avec recherche textuelle instantanée, badge de code postal, fermeture au clic extérieur et accessibilité clavier.
- **Générateur Automatique de Commande WhatsApp** : Formatage automatique des détails du véhicule (Marque, Modèle, Année, Type de pièce, Description) et redirection vers l'atelier direct (`+213 777 50 30 18`).

### 📦 Catalogue Technique & Avis Clients
- **Catalogue Filtrable & Recherche Instantanée** : Filtres par marque (Seat, Peugeot, Chevrolet...) et recherche multi-critères.
- **Carrousel 3D Retours d'Atelier** : Carte interactive inclinée selon la position de la souris (spring tilt 3D), support des gestes tactiles (swipe mobile) et rotation continue.

---

## ⚡ Performances & Métriques Clés

| Métrique | Avant Optimisation | Après Optimisation | Gain / Bénéfice |
| :--- | :--- | :--- | :--- |
| **Poids du Bundle Initial** | 1 012 Ko | **268 Ko** (80 Ko gzip) | ⚡ **-73.5% de taille initiale** |
| **Temps de Préchargement Logo** | ~3 200 ms (GLB 3D 2.9 Mo) | **< 60 ms** (PNG 87 Ko) | 🚀 **50x plus rapide** |
| **Consommation Réseau Vidéo Mobile** | 27 Mo (double stream) | **12 Mo** (stream unique) | 📱 **15 Mo économisés** |
| **Activité GPU hors viewport** | 100% permanente (60-120 FPS) | **0% (suspendu)** | 🔋 **Autonomie batterie & zéro crash** |
| **Rendu Curseur HUD** | Re-render React à chaque pixel | **0 re-render** (Direct DOM) | 🎯 **Fluidité 120 Hz constante** |

---

## 🛠️ Stack Technique

- **Frontend Core** : [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Moteur 3D & Métrologie** : [Three.js](https://threejs.org/) (GLTFLoader, OrbitControls)
- **Design System & Styling** : [Tailwind CSS 3](https://tailwindcss.com/)
- **Micro-Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Iconographie** : [Lucide React](https://lucide.dev/)
- **Typographies** : Syne (Titres), Space Grotesk (Corps technique), JetBrains Mono (Télémétrie CAO)

---

## 💻 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) v18.0.0 ou supérieur
- Gestionnaire de paquets `npm`, `yarn` ou `pnpm`

### Installation & Développement

```bash
# 1. Cloner le dépôt
git clone https://github.com/khalil-hamidani/CJERF-AUTOMOTIVE.git
cd CJERF-AUTOMOTIVE

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement local
npm run dev
```

L'application est disponible immédiatement sur : `http://localhost:5173`.

### Compilation de Production

```bash
# Compiler et optimiser les assets pour le déploiement
npm run build

# Prévisualiser la version de production localement
npm run preview
```

---

## 🌐 Guide de Déploiement

Le projet est pré-configuré pour un déploiement instantané sur toutes les plateformes modernes :

### Déploiement sur Vercel
1. Importer le dépôt GitHub sur [Vercel](https://vercel.com).
2. Framework Preset : **Vite**.
3. Build Command : `npm run build`.
4. Output Directory : `dist`.
5. Cliquer sur **Deploy**.

### Déploiement sur Netlify
1. Connecter le dépôt sur [Netlify](https://netlify.com).
2. Build command : `npm run build`.
3. Publish directory : `dist`.
4. Déployer.

---

## 📁 Architecture du Projet

```text
CJERF-AUTOMOTIVE/
├── public/
│   ├── assets/
│   │   ├── models/           # Modèles CAO 1:1 GLB (107, aveo, saxo, 308, logo)
│   │   ├── products/         # Visuels pièces catalogue (Ibiza, 107, Aveo, etc.)
│   │   ├── scroll-frames/    # 108 frames WebP du processus de fabrication
│   │   ├── hero-cinematic.mp4# Vidéo Hero grand écran
│   │   ├── hero-mobile.mp4   # Vidéo Hero format vertical smartphone
│   │   ├── fabrication-mobile.mp4 # Vidéo mobile section fabrication
│   │   ├── hero_poster.jpg   # Poster de repli haute définition
│   │   ├── cjerf-logo-dark.png       # Logo principal blanc haute résolution
│   │   └── cjerf-logo-transparent.png# Logo secondaire
├── src/
│   ├── components/
│   │   ├── preloader/
│   │   │   ├── LoadingOverlay.jsx # Écran de chargement avec jauge 70%
│   │   │   └── LogoPreloader.jsx  # Logo animé léger (zéro WebGL)
│   │   ├── CatalogPage.jsx   # Page Catalogue dédiée (chargée à la demande)
│   │   ├── CustomPartPage.jsx# Page Commande Sur-Mesure (chargée à la demande)
│   │   ├── Header.jsx        # Navigation persistante & menu mobile
│   │   ├── Hero.jsx          # Section Hero cinématique avec stream adaptatif
│   │   ├── HudCursor.jsx     # Curseur télémétrique sans re-render
│   │   ├── Logo3DFlying.jsx  # Logo 3D interactif Three.js avec suspension
│   │   ├── ModelViewer3D.jsx # Banc d'inspection CAO avec cotations 1:1
│   │   ├── PrinterCarVideo.jsx# Scrubber 108 frames & fallback mobile
│   │   ├── StatsShowcase.jsx # Compteurs télémétriques atelier
│   │   ├── ClientReviews.jsx # Carrousel d'avis 3D tilt (58 wilayas)
│   │   ├── WilayaDropdown.jsx# Sélecteur stylisé des 58 Wilayas
│   │   └── Footer.jsx        # Pied de page avec réseaux et crédits
│   ├── config/
│   │   └── contact.js        # Coordonnées atelier et URLs API WhatsApp
│   ├── hooks/
│   │   └── useAssetLoader.js # Hook d'écoute de la progression du chargement
│   ├── utils/
│   │   └── AssetLoadingManager.js # Orchestration et préchargement d'assets
│   ├── App.jsx               # Routage SPA et code-splitting Suspense
│   ├── index.css             # Directives Tailwind CSS & variables globales
│   └── main.jsx              # Montage React DOM
├── index.html                # Point d'entrée HTML avec préchargement d'assets
├── package.json              # Dépendances et scripts de build
├── tailwind.config.js        # Thème automobile noir & rouge motorsport
└── vite.config.js            # Configuration des chunks Rollup (Three, Framer, Lucide)
```

---

## 📞 Contact Atelier & Support

- **Atelier** : CJERF Automotive
- **Localisation** : Alger, Algérie 🇩🇿 *(Expédition disponible sur les 58 Wilayas)*
- **WhatsApp Officiel** : [+213 777 50 30 18](https://wa.me/213777503018)
- **Instagram** : [@cjerfautomotive_](https://www.instagram.com/cjerfautomotive_/)
- **Conception & Développement** : [Khalil Hamidani](https://github.com/khalil-hamidani)

---

<div align="center">
  <sub>Développé avec passion pour l'ingénierie automobile et l'artisanat numérique en Algérie.</sub>
</div>
