import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Premium Asset Loading Manager with Progressive Workload Tracking
 * 
 * Manages essential asset preloading with weighted tasks, monotonic progress,
 * and automatic 70% reveal threshold trigger.
 */
class AssetLoadingManager {
  constructor() {
    this.listeners = new Set();
    this.modelCache = new Map();
    this.tasks = new Map();
    this.progress = 0;
    this.revealed = false;
    this.complete = false;
    this.started = false;
    this.hasError = false;
    this.statusMessage = 'Initialisation atelier...';

    // Global safety watchdog timer (never stays stuck on loading screen)
    this.watchdogTimeout = null;

    // Essential initial tasks with weights (Total = 100)
    // Logo (25) + Hero Poster (15) + Hero Video (30) = exactly 70% reveal threshold!
    this.registerTasks([
      { id: 'logo-image', label: 'Identité Visuelle Atelier', weight: 25 },
      { id: 'hero-poster', label: 'Affiche Haute Définition', weight: 15 },
      { id: 'hero-video', label: 'Cinématique Atelier', weight: 30 },
      { id: 'ui-fonts', label: 'Typographies & Interface', weight: 15 },
      { id: 'first-cad-model', label: 'Modèle CAO Principal', weight: 15 },
    ]);
  }

  registerTasks(taskList) {
    taskList.forEach(({ id, label, weight }) => {
      this.tasks.set(id, {
        id,
        label,
        weight,
        status: 'pending', // 'pending' | 'loading' | 'loaded' | 'failed'
        progress: 0,
      });
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Immediately emit current state
    callback(this.getState());
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((callback) => {
      try {
        callback(state);
      } catch (err) {
        console.warn('Listener error in AssetLoadingManager:', err);
      }
    });
  }

  getState() {
    return {
      progress: this.progress,
      isRevealed: this.revealed,
      isComplete: this.complete,
      statusMessage: this.statusMessage,
      tasks: Array.from(this.tasks.values()),
      hasError: this.hasError,
    };
  }

  updateTask(id, updates) {
    const task = this.tasks.get(id);
    if (!task) return;

    Object.assign(task, updates);
    this.calculateProgress();
  }

  calculateProgress() {
    let totalWeight = 0;
    let completedWeight = 0;

    this.tasks.forEach((task) => {
      totalWeight += task.weight;
      if (task.status === 'loaded' || task.status === 'failed') {
        completedWeight += task.weight;
      } else if (task.status === 'loading') {
        completedWeight += task.weight * (task.progress || 0);
      }
    });

    const rawPercentage = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
    
    // Monotonic guarantee: progress must NEVER move backward
    const newProgress = Math.min(100, Math.max(this.progress, Math.floor(rawPercentage)));
    this.progress = newProgress;

    // Check 70% Reveal Threshold (strictly triggered once)
    if (this.progress >= 70 && !this.revealed) {
      this.revealed = true;
      this.statusMessage = 'Atelier opérationnel';
    }

    if (this.progress >= 100 && !this.complete) {
      this.complete = true;
      this.statusMessage = 'Ressources chargées à 100%';
    }

    this.notify();
  }

  /**
   * Safe preloading of 3D GLB Model using Three.js GLTFLoader
   */
  async preloadGLB(url, taskId) {
    if (this.modelCache.has(url)) {
      this.updateTask(taskId, { status: 'loaded', progress: 1 });
      return this.modelCache.get(url);
    }

    this.updateTask(taskId, { status: 'loading', progress: 0.1 });

    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      
      // Safety timeout for GLB
      const timeoutId = setTimeout(() => {
        console.warn(`[AssetLoadingManager] GLB preload timed out for ${url}`);
        this.updateTask(taskId, { status: 'failed', progress: 1 });
        resolve(null);
      }, 4500);

      loader.load(
        url,
        (gltf) => {
          clearTimeout(timeoutId);
          this.modelCache.set(url, gltf);
          this.updateTask(taskId, { status: 'loaded', progress: 1 });
          resolve(gltf);
        },
        (xhr) => {
          if (xhr.lengthComputable && xhr.total > 0) {
            const ratio = xhr.loaded / xhr.total;
            this.updateTask(taskId, { progress: Math.min(0.9, ratio) });
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.warn(`[AssetLoadingManager] GLB preload error for ${url}:`, error);
          this.hasError = true;
          this.updateTask(taskId, { status: 'failed', progress: 1 });
          resolve(null);
        }
      );
    });
  }

  /**
   * Preload an image asset (resolves immediately if cached)
   */
  preloadImage(url, taskId) {
    this.updateTask(taskId, { status: 'loading', progress: 0.2 });

    return new Promise((resolve) => {
      const img = new Image();
      
      const timeoutId = setTimeout(() => {
        console.warn(`[AssetLoadingManager] Image preload timed out for ${url}`);
        this.updateTask(taskId, { status: 'failed', progress: 1 });
        resolve();
      }, 3500);

      img.onload = () => {
        clearTimeout(timeoutId);
        this.updateTask(taskId, { status: 'loaded', progress: 1 });
        resolve();
      };

      img.onerror = (err) => {
        clearTimeout(timeoutId);
        console.warn(`[AssetLoadingManager] Image preload error for ${url}:`, err);
        this.updateTask(taskId, { status: 'failed', progress: 1 });
        resolve();
      };

      img.src = url;
      // If already cached and loaded synchronously
      if (img.complete) {
        clearTimeout(timeoutId);
        this.updateTask(taskId, { status: 'loaded', progress: 1 });
        resolve();
      }
    });
  }

  /**
   * Preload video buffer readiness (e.g. loadeddata / canplay)
   */
  preloadVideo(url, taskId) {
    this.updateTask(taskId, { status: 'loading', progress: 0.2 });

    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;

      const finish = (status) => {
        clearTimeout(timeoutId);
        video.removeAttribute('src');
        video.load();
        this.updateTask(taskId, { status, progress: 1 });
        resolve();
      };

      // Video safety timeout
      const timeoutId = setTimeout(() => {
        console.warn(`[AssetLoadingManager] Video preload timed out for ${url}`);
        finish('loaded'); // Treat as resolved so video can stream naturally
      }, 3500);

      video.onloadeddata = () => finish('loaded');
      video.oncanplay = () => finish('loaded');
      video.onerror = (err) => {
        console.warn(`[AssetLoadingManager] Video preload error for ${url}:`, err);
        finish('failed');
      };

      video.src = url;
      video.load();
    });
  }

  /**
   * Preload critical UI fonts
   */
  async preloadFonts(taskId) {
    this.updateTask(taskId, { status: 'loading', progress: 0.5 });
    try {
      if (document.fonts && document.fonts.ready) {
        await Promise.race([
          document.fonts.ready,
          new Promise((r) => setTimeout(r, 1500)),
        ]);
      }
      this.updateTask(taskId, { status: 'loaded', progress: 1 });
    } catch {
      this.updateTask(taskId, { status: 'loaded', progress: 1 });
    }
  }

  /**
   * Start the progressive loading pipeline
   */
  start() {
    if (this.started) return;
    this.started = true;
    this.statusMessage = 'Calibrage de l’atelier...';
    this.notify();

    // Global Safety Watchdog (Guarantees reveal after 3.5s maximum under any condition)
    this.watchdogTimeout = setTimeout(() => {
      if (!this.revealed) {
        console.warn('[AssetLoadingManager] Safety watchdog triggered website reveal.');
        this.progress = Math.max(75, this.progress);
        this.revealed = true;
        this.notify();
      }
    }, 3500);

    // Prioritized Asset Pipeline Execution:
    // 1. Critical Logo Image (Tier 1) - instantaneous, cached, lightweight
    const logoPromise = this.preloadImage('/assets/cjerf-logo-dark.png', 'logo-image');

    // 2. Viewport Hero Poster (Tier 1)
    const posterPromise = this.preloadImage('/assets/hero_poster.jpg', 'hero-poster');

    // 3. Hero Video initial buffer (Tier 2)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const videoUrl = isMobile ? '/assets/hero-mobile.mp4' : '/assets/hero-cinematic.mp4';
    const videoPromise = this.preloadVideo(videoUrl, 'hero-video');

    // 4. Critical UI Fonts (Tier 2)
    const fontsPromise = this.preloadFonts('ui-fonts');

    // 5. First CAD Model (Tier 2/3)
    const cadPromise = this.preloadGLB('/assets/models/cache-remorquage-107.glb', 'first-cad-model');

    // Once essential workload completes, initiate deferred non-essential background tasks
    Promise.allSettled([logoPromise, posterPromise, videoPromise, fontsPromise, cadPromise]).then(() => {
      if (this.watchdogTimeout) clearTimeout(this.watchdogTimeout);
      this.progress = 100;
      this.complete = true;
      this.statusMessage = 'Atelier 100% synchronisé';
      this.notify();

      // Defer non-essential secondary models in idle background
      this.preloadDeferredAssets();
    });
  }

  /**
   * Defer secondary 3D models and media until after website is interactive
   */
  preloadDeferredAssets() {
    const deferredModels = [
      '/assets/models/pare-choc-aveo-extension.glb',
      '/assets/models/obus-saxo.glb',
      '/assets/models/support-radar-308.glb',
    ];

    const runIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1000));
    runIdle(() => {
      deferredModels.forEach((url) => {
        if (!this.modelCache.has(url)) {
          const loader = new GLTFLoader();
          loader.load(
            url,
            (gltf) => this.modelCache.set(url, gltf),
            undefined,
            () => {} // Silent catch for deferred assets
          );
        }
      });
    });
  }

  forceReveal() {
    this.progress = Math.max(70, this.progress);
    this.revealed = true;
    this.notify();
  }
}

export const assetLoader = new AssetLoadingManager();
if (typeof window !== 'undefined') {
  window.__assetLoader = assetLoader;
}
export default assetLoader;
