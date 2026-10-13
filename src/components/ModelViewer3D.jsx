import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Boxes, RotateCcw, Play, Pause, Ruler } from 'lucide-react';

const MODELS = [
  {
    id: 'cache-107',
    name: 'Cache Remorquage Avant',
    vehicle: 'Peugeot 107 (2005–2014)',
    category: 'Cache Pare-Choc Perdu',
    file: '/assets/models/cache-remorquage-107.glb',
    material: 'Polymère Anti-UV Teinté Masse',
    tolerance: '±0.05 mm',
    description: 'Réplique exacte de la pièce disparue en concession. Ergots doubles anti-vibration.',
  },
  {
    id: 'aveo-extension',
    name: 'Extension Pare-Choc Avant',
    vehicle: 'Chevrolet Aveo LS T250',
    category: 'Lame & Bouclier Inférieur',
    file: '/assets/models/pare-choc-aveo-extension.glb',
    material: 'ABS Technique Haute Rigidité',
    tolerance: '±0.05 mm',
    description: 'Extension d’ajustement sous calandre. Restaure l’alignement d’origine du bouclier.',
  },
  {
    id: 'obus-saxo',
    name: 'Coque Rétroviseur Obus',
    vehicle: 'Citroën Saxo VTS / Phase 2',
    category: 'Aérodynamisme & Rétrovision',
    file: '/assets/models/obus-saxo.glb',
    material: 'PETG-Carbone 110°C',
    tolerance: '±0.05 mm',
    description: 'Profil aérodynamique galbé spécifique coupe Saxo. Pattes de fixation internes renforcées.',
  },
  {
    id: 'support-radar-308',
    name: 'Support Radar de Recul',
    vehicle: 'Peugeot 308 (Phase 1 & 2)',
    category: 'Support Capteur Bumper',
    file: '/assets/models/support-radar-308.glb',
    material: 'PETG Résistant Hydrocarbures',
    tolerance: '±0.05 mm',
    description: 'Bague de maintien du capteur ultrason avec clipsage étanche dans le pare-choc arrière.',
  },
];

export default function ModelViewer3D() {
  const containerRef = useRef(null);
  const [activeModelIdx, setActiveModelIdx] = useState(0);
  const [viewMode, setViewMode] = useState('cotations'); // 'solide' | 'cotations'
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [loading, setLoading] = useState(true);
  const [realDimensions, setRealDimensions] = useState({ x: 0, y: 0, z: 0 });

  const sceneRef = useRef(null);
  const modelGroupRef = useRef(null);
  const dimensionsGroupRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);
  const loadIdRef = useRef(0);
  const viewModeRef = useRef('cotations');

  // DOM label refs for 60-120 FPS high-performance positioning without React re-renders
  const labelXRef = useRef(null);
  const labelYRef = useRef(null);
  const labelZRef = useRef(null);
  const anchorsRef = useRef({
    x: new THREE.Vector3(),
    y: new THREE.Vector3(),
    z: new THREE.Vector3(),
  });

  const activeModel = MODELS[activeModelIdx];

  // Sync ref with state
  useEffect(() => {
    viewModeRef.current = viewMode;
    if (dimensionsGroupRef.current) {
      dimensionsGroupRef.current.visible = viewMode === 'cotations';
    }
    // Update model material finish based on mode
    if (modelGroupRef.current) {
      modelGroupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (viewMode === 'cotations') {
            child.material.color.setHex(0x232730);
            child.material.roughness = 0.45;
            child.material.metalness = 0.2;
          } else {
            child.material.color.setHex(0x404550);
            child.material.roughness = 0.35;
            child.material.metalness = 0.3;
          }
        }
      });
    }
  }, [viewMode]);

  // Initialize Three.js scene once
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 520;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Dedicated Group for model and dimensions
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const dimensionsGroup = new THREE.Group();
    modelGroup.add(dimensionsGroup);
    dimensionsGroupRef.current = dimensionsGroup;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.4, 1.8, 3.6);
    cameraRef.current = camera;

    // Renderer - Optimized DPR and Zero Heavy Shadow Pass
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;
    controls.minDistance = 1.8;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 1.7;
    controlsRef.current = controls;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa5b5cc, 1.8);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const underLight = new THREE.DirectionalLight(0x758095, 1.2);
    underLight.position.set(0, -4, 2);
    scene.add(underLight);

    const redRimLight = new THREE.DirectionalLight(0xff1e27, 3.5);
    redRimLight.position.set(-3, 3, -4);
    scene.add(redRimLight);

    // IntersectionObserver to suspend 3D rendering when out of viewport
    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting && !animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05, rootMargin: '150px 0px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    // High-performance animation loop
    const animate = () => {
      if (!isVisible) {
        animFrameRef.current = null;
        return;
      }

      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();

      // Project 3D dimension anchor coordinates to 2D screen positions
      if (viewModeRef.current === 'cotations' && containerRef.current && cameraRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;

        const updateAnchor = (anchorVec, labelEl) => {
          if (!labelEl) return;
          const v = anchorVec.clone();
          if (modelGroupRef.current) {
            v.applyMatrix4(modelGroupRef.current.matrixWorld);
          }
          v.project(cameraRef.current);

          // Hide if behind camera lens
          if (v.z > 1) {
            labelEl.style.opacity = '0';
            return;
          }

          const screenX = (v.x * 0.5 + 0.5) * w;
          const screenY = (-v.y * 0.5 + 0.5) * h;
          labelEl.style.opacity = '1';
          labelEl.style.transform = `translate(-50%, -50%) translate3d(${screenX}px, ${screenY}px, 0)`;
        };

        updateAnchor(anchorsRef.current.x, labelXRef.current);
        updateAnchor(anchorsRef.current.y, labelYRef.current);
        updateAnchor(anchorsRef.current.z, labelZRef.current);
      } else {
        if (labelXRef.current) labelXRef.current.style.opacity = '0';
        if (labelYRef.current) labelYRef.current.style.opacity = '0';
        if (labelZRef.current) labelZRef.current.style.opacity = '0';
      }

      renderer.render(scene, camera);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 520;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else child.material.dispose();
        }
      });

      try {
        renderer.forceContextLoss();
      } catch (e) {}
      renderer.dispose();
      controls.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Build real CAD dimension lines and CMM datum grid
  const createDimensionLines = (scaledBox, rawDimensions) => {
    const group = new THREE.Group();

    const hx = (scaledBox.max.x - scaledBox.min.x) / 2;
    const hy = (scaledBox.max.y - scaledBox.min.y) / 2;
    const hz = (scaledBox.max.z - scaledBox.min.z) / 2;

    const gap = 0.24;
    const tick = 0.05;

    const redLineMat = new THREE.LineBasicMaterial({
      color: 0xe10600,
      linewidth: 2,
      transparent: true,
      opacity: 0.95,
    });

    const extensionLineMat = new THREE.LineBasicMaterial({
      color: 0x828795,
      transparent: true,
      opacity: 0.55,
    });

    const addLine = (p1, p2, mat) => {
      const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      group.add(new THREE.Line(geom, mat));
    };

    // 1. Dimension X (Largeur)
    const yX = -hy - gap;
    const zX = hz + gap;
    // Extension lines
    addLine(new THREE.Vector3(-hx, -hy, hz), new THREE.Vector3(-hx, yX - 0.06, zX), extensionLineMat);
    addLine(new THREE.Vector3(hx, -hy, hz), new THREE.Vector3(hx, yX - 0.06, zX), extensionLineMat);
    // Main dimension line
    addLine(new THREE.Vector3(-hx, yX, zX), new THREE.Vector3(hx, yX, zX), redLineMat);
    // CAD Ticks
    addLine(new THREE.Vector3(-hx - tick, yX - tick, zX), new THREE.Vector3(-hx + tick, yX + tick, zX), redLineMat);
    addLine(new THREE.Vector3(hx - tick, yX - tick, zX), new THREE.Vector3(hx + tick, yX + tick, zX), redLineMat);
    anchorsRef.current.x.set(0, yX, zX);

    // 2. Dimension Y (Hauteur)
    const xY = -hx - gap;
    const zY = hz + gap;
    // Extension lines
    addLine(new THREE.Vector3(-hx, -hy, hz), new THREE.Vector3(xY - 0.06, -hy, zY), extensionLineMat);
    addLine(new THREE.Vector3(-hx, hy, hz), new THREE.Vector3(xY - 0.06, hy, zY), extensionLineMat);
    // Main dimension line
    addLine(new THREE.Vector3(xY, -hy, zY), new THREE.Vector3(xY, hy, zY), redLineMat);
    // CAD Ticks
    addLine(new THREE.Vector3(xY - tick, -hy - tick, zY), new THREE.Vector3(xY + tick, -hy + tick, zY), redLineMat);
    addLine(new THREE.Vector3(xY - tick, hy - tick, zY), new THREE.Vector3(xY + tick, hy + tick, zY), redLineMat);
    anchorsRef.current.y.set(xY, 0, zY);

    // 3. Dimension Z (Profondeur)
    const xZ = hx + gap;
    const yZ = -hy - gap;
    // Extension lines
    addLine(new THREE.Vector3(hx, -hy, -hz), new THREE.Vector3(xZ + 0.06, yZ, -hz), extensionLineMat);
    addLine(new THREE.Vector3(hx, -hy, hz), new THREE.Vector3(xZ + 0.06, yZ, hz), extensionLineMat);
    // Main dimension line
    addLine(new THREE.Vector3(xZ, yZ, -hz), new THREE.Vector3(xZ, yZ, hz), redLineMat);
    // CAD Ticks
    addLine(new THREE.Vector3(xZ, yZ - tick, -hz - tick), new THREE.Vector3(xZ, yZ + tick, -hz + tick), redLineMat);
    addLine(new THREE.Vector3(xZ, yZ - tick, hz - tick), new THREE.Vector3(xZ, yZ + tick, hz + tick), redLineMat);
    anchorsRef.current.z.set(xZ, yZ, 0);

    // 4. Precision CMM Datum Table Grid
    const grid = new THREE.GridHelper(3.0, 16, 0xe10600, 0x22252d);
    grid.position.set(0, -hy - gap - 0.08, 0);
    group.add(grid);

    return group;
  };

  // Load active model with race condition protection
  useEffect(() => {
    if (!modelGroupRef.current) return;
    setLoading(true);

    const thisRequestId = ++loadIdRef.current;
    const loader = new GLTFLoader();

    loader.load(
      activeModel.file,
      (gltf) => {
        if (thisRequestId !== loadIdRef.current) return;

        const group = modelGroupRef.current;
        // Clean out previous model and dimension objects
        while (group.children.length > 0) {
          const child = group.children[0];
          child.traverse((c) => {
            if (c.geometry) c.geometry.dispose();
            if (c.material) {
              if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
              else c.material.dispose();
            }
          });
          group.remove(child);
        }

        const model = gltf.scene;

        // 1. Calculate genuine physical CAD dimensions directly from GLB vertices (1:1 mm)
        model.updateMatrixWorld(true);
        const rawBox = new THREE.Box3().setFromObject(model);
        const rawSize = new THREE.Vector3();
        rawBox.getSize(rawSize);

        const realDimX = Number(rawSize.x.toFixed(1));
        const realDimY = Number(rawSize.y.toFixed(1));
        const realDimZ = Number(rawSize.z.toFixed(1));
        const genuineDimensions = { x: realDimX, y: realDimY, z: realDimZ };
        setRealDimensions(genuineDimensions);

        // 2. Scale model to standard 2.2 viewport units
        const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z);
        const targetSize = 2.2;
        const scale = targetSize / maxDim;
        model.scale.setScalar(scale);
        model.updateMatrixWorld(true);

        // 3. Center model exactly at (0, 0, 0)
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        model.position.sub(scaledCenter);
        model.updateMatrixWorld(true);

        // 4. Apply high-precision automotive material
        const isCotations = viewModeRef.current === 'cotations';
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = new THREE.MeshStandardMaterial({
              color: isCotations ? 0x232730 : 0x404550,
              roughness: isCotations ? 0.45 : 0.35,
              metalness: isCotations ? 0.2 : 0.3,
            });
          }
        });

        group.add(model);

        // 5. Build and attach CAD dimension lines and CMM table
        const normalizedBox = new THREE.Box3().setFromObject(model);
        const dimensions = createDimensionLines(normalizedBox, genuineDimensions);
        dimensions.visible = isCotations;
        group.add(dimensions);
        dimensionsGroupRef.current = dimensions;

        // Smooth camera positioning
        if (cameraRef.current && controlsRef.current) {
          cameraRef.current.position.set(2.4, 1.8, 3.6);
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }

        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading 3D model:', error);
        setLoading(false);
      }
    );
  }, [activeModelIdx]);

  // Update auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(2.4, 1.8, 3.6);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div id="visualiseur-3d" className="min-h-[55vh] flex flex-col justify-center px-4 sm:px-8 pt-16 sm:pt-20 pb-12 lg:pb-16 max-w-[1480px] mx-auto w-full relative z-10 scroll-mt-24">
      
      {/* Header telemetry & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cjerf-red/10 border border-cjerf-red/25 mb-3">
            <Boxes className="w-3.5 h-3.5 text-cjerf-red" />
            <span className="font-mono text-xs font-semibold tracking-wider text-cjerf-red uppercase">
              Banc d'Inspection CAO // Tolérance ±0.05 mm
            </span>
          </div>
          <h3 className="font-display font-bold text-2xl sm:text-4xl text-white uppercase tracking-tight">
            Visualiseur 3D Haute Précision.
          </h3>
        </div>

        {/* Live CAD Dimension Summary */}
        <div className="hidden lg:flex items-center space-x-3 font-mono text-xs text-zinc-300 bg-zinc-900/60 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
          <span className="text-zinc-500">COTES CAO (1:1) :</span>
          <span className="text-white font-bold">{realDimensions.x} × {realDimensions.y} × {realDimensions.z} mm</span>
          <span className="text-cjerf-red font-semibold">• ±0.05 mm OEM</span>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        {MODELS.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setActiveModelIdx(idx)}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center space-x-2 border ${
              activeModelIdx === idx
                ? 'bg-cjerf-red text-white border-cjerf-red shadow-lg shadow-cjerf-red/20 font-bold'
                : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            <span className={activeModelIdx === idx ? 'text-white' : 'text-zinc-500'}>
              0{idx + 1}.
            </span>
            <span>{m.name}</span>
          </button>
        ))}
      </div>

      {/* Main 3D Stage Card */}
      <div className="relative rounded-2xl lg:rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/50 via-zinc-950/80 to-cjerf-black overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* Top Floating Model Specs HUD */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
          <div>
            <div className="font-mono text-xs text-cjerf-red font-semibold uppercase tracking-wider">
              {activeModel.vehicle}
            </div>
            <div className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              {activeModel.name}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-zinc-300">
            <span className="px-2.5 py-1 rounded bg-black/75 border border-white/10 backdrop-blur-md">
              DIM : {realDimensions.x} × {realDimensions.y} × {realDimensions.z} mm
            </span>
            <span className="px-2.5 py-1 rounded bg-black/75 border border-white/10 backdrop-blur-md text-cjerf-red font-semibold">
              TOL : {activeModel.tolerance}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-black/75 border border-white/10 backdrop-blur-md text-zinc-400">
              {activeModel.material}
            </span>
          </div>
        </div>

        {/* 3D WebGL Canvas Container */}
        <div
          ref={containerRef}
          className="w-full h-[400px] sm:h-[480px] lg:h-[520px] cursor-grab active:cursor-grabbing relative"
        />

        {/* 2D Projected Dimension Badges (anchored to 3D model midpoints) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {/* Label X (Largeur) */}
          <div
            ref={labelXRef}
            className="absolute transition-opacity duration-150 top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-0"
          >
            <div className="px-2.5 py-1 rounded-lg bg-black/90 border border-cjerf-red/60 text-white font-mono text-[11px] shadow-xl backdrop-blur-md flex items-center space-x-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-cjerf-red" />
              <span className="text-zinc-400">LARGEUR :</span>
              <span className="text-white font-bold">{realDimensions.x} mm</span>
            </div>
          </div>

          {/* Label Y (Hauteur) */}
          <div
            ref={labelYRef}
            className="absolute transition-opacity duration-150 top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-0"
          >
            <div className="px-2.5 py-1 rounded-lg bg-black/90 border border-cjerf-red/60 text-white font-mono text-[11px] shadow-xl backdrop-blur-md flex items-center space-x-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-cjerf-red" />
              <span className="text-zinc-400">HAUTEUR :</span>
              <span className="text-white font-bold">{realDimensions.y} mm</span>
            </div>
          </div>

          {/* Label Z (Profondeur) */}
          <div
            ref={labelZRef}
            className="absolute transition-opacity duration-150 top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-0"
          >
            <div className="px-2.5 py-1 rounded-lg bg-black/90 border border-cjerf-red/60 text-white font-mono text-[11px] shadow-xl backdrop-blur-md flex items-center space-x-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-cjerf-red" />
              <span className="text-zinc-400">PROFONDEUR :</span>
              <span className="text-white font-bold">{realDimensions.z} mm</span>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cjerf-black/80 backdrop-blur-sm z-30 pointer-events-none">
            <div className="w-8 h-8 rounded-full border-2 border-cjerf-red border-t-transparent animate-spin mb-3" />
            <span className="font-mono text-xs text-zinc-300 uppercase tracking-widest">
              Calcul des Cotations CAO...
            </span>
          </div>
        )}

        {/* Bottom Floating Controls Bar */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-3 z-20 pointer-events-auto">
          
          {/* Action Tools: SOLIDE / COTATIONS Switch */}
          <div className="flex items-center space-x-2 bg-cjerf-black/85 backdrop-blur-md border border-white/15 rounded-full p-1 shadow-xl">
            
            {/* Mode Switch: SOLIDE / COTATIONS */}
            <button
              onClick={() => setViewMode('solide')}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                viewMode === 'solide'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Solide
            </button>

            <button
              onClick={() => setViewMode('cotations')}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                viewMode === 'cotations'
                  ? 'bg-cjerf-red text-white shadow-lg shadow-cjerf-red/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Cotations</span>
            </button>

            <div className="w-[1px] h-4 bg-white/20 mx-1" />

            {/* Auto-Rotate Toggle */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={isAutoRotating ? 'Pause rotation' : 'Reprendre rotation'}
            >
              {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Reset Camera */}
            <button
              onClick={handleResetCamera}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Réinitialiser l'angle de vue"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hint Overlay */}
          <div className="hidden sm:flex items-center space-x-2 font-mono text-[11px] text-zinc-400 bg-cjerf-black/75 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cjerf-red animate-pulse" />
            <span>
              {viewMode === 'cotations'
                ? 'COTES 3D DYNAMIQUES • GLISSER POUR INSPECTER'
                : 'MODÈLE 3D PLEIN • PIVOTER À 360°'}
            </span>
          </div>

        </div>

      </div>

      {/* Model Brief Strip */}
      <div className="mt-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 gap-2 font-light">
        <div>
          <span className="text-zinc-300 font-medium">{activeModel.category} : </span>
          {activeModel.description}
        </div>
        <div className="font-mono text-[11px] text-zinc-500 whitespace-nowrap">
          EXPORT CAO 1:1 • MESURES BRUTES EXTRAITES DU GLB
        </div>
      </div>

    </div>
  );
}
