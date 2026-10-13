import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Logo3DFlying({ align = 'center', variant = 'default', className = '' }) {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 240;

    // 1. Scene & Fixed Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    // Dynamically calculate camera distance Z to fit the desired container width
    const updateCameraFrustum = (w, h) => {
      if (!w || !h) return;
      const aspect = w / h;
      camera.aspect = aspect;

      if (variant === 'hero') {
        // Model width is 2.81, height is 0.69 after PI/2 rotation
        // Fits nicely across ~60% width of the text container
        const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const targetZForWidth = 2.81 / (0.94 * 2 * tanHalfFov * aspect);
        const minZForHeight = 0.69 / (0.76 * 2 * tanHalfFov);
        camera.position.set(0, 0, Math.max(targetZForWidth, minZForHeight));
      } else {
        // Responsive camera distance to cleanly fit narrow mobile viewports
        const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const targetZForWidth = 2.81 / (0.85 * 2 * tanHalfFov * aspect);
        camera.position.set(0, 0, Math.max(3.4, targetZForWidth));
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    // 2. Renderer (Completely transparent, borderless, floating)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    updateCameraFrustum(width, height);

    const canvas = renderer.domElement;
    canvas.style.touchAction = 'pan-y'; // Allows natural touch scrolling without interruption
    canvas.className = 'w-full h-full cursor-grab active:cursor-grabbing outline-none select-none';
    container.appendChild(canvas);

    // 3. Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333338, 2.5);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.2);
    dirLight1.position.set(5, 6, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight2.position.set(-5, 4, 4);
    scene.add(dirLight2);

    const redAccent = new THREE.DirectionalLight(0xe10600, 2.2);
    redAccent.position.set(0, -4, 4);
    scene.add(redAccent);

    // 4. Object Hierarchy for Floating + Tactile Spring Rotation
    // floatGroup: handles slow vertical hover
    // rotationGroup: handles mouse drag rotation and smooth spring-back
    const floatGroup = new THREE.Group();
    const rotationGroup = new THREE.Group();
    floatGroup.add(rotationGroup);
    scene.add(floatGroup);

    // 5. Load GLB Logo with white text
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/Cjerfautomotive 3D LOGO White.glb',
      (gltf) => {
        const model = gltf.scene;

        // Model is designed flat on X-Z, rotate +90 deg on X to face camera upright
        model.rotation.set(Math.PI / 2, 0, 0);

        // Center model geometry at (0, 0, 0)
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Material luster
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.roughness = 0.25;
            child.material.metalness = 0.35;
            child.material.needsUpdate = true;
          }
        });

        rotationGroup.add(model);
        setIsLoaded(true);
      },
      undefined,
      (err) => console.warn('Error loading 3D logo:', err)
    );

    // 6. Interactive Mouse Drag with Smooth Spring-Back
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      targetRotY += deltaX * 0.007;
      targetRotX += deltaY * 0.007;

      // Clamp rotation angles so it doesn't flip into strange upside-down views
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      targetRotY = Math.max(-1.1, Math.min(1.1, targetRotY));
    };

    const onPointerUp = () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
      // Once released, target smoothly resets to initial state (0, 0)
      targetRotX = 0;
      targetRotY = 0;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      updateCameraFrustum(container.clientWidth, container.clientHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Animation Loop with IntersectionObserver Suspension
    const clock = new THREE.Clock();
    let isVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting && !animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Slow, gentle vertical hovering in place (floating without spinning)
      floatGroup.position.y = Math.sin(elapsed * 1.2) * 0.04;

      // Spring-back physics: when released, lerp smoothly back to initial state
      const springFactor = isDragging ? 0.22 : 0.055;
      currentRotX += (targetRotX - currentRotX) * springFactor;
      currentRotY += (targetRotY - currentRotY) * springFactor;

      rotationGroup.rotation.x = currentRotX;
      rotationGroup.rotation.y = currentRotY;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 9. Thorough Cleanup and Memory Release
    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

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
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [variant]);

  const isLeft = align === 'left';
  const isHero = variant === 'hero';

  return (
    <div className={`relative w-full flex flex-col ${isLeft ? 'items-start' : 'items-center'} justify-center ${className}`}>
      {/* 3D Canvas Container - strictly borderless, transparent, floating */}
      <div
        ref={mountRef}
        className={`w-full ${
          isHero
            ? 'w-[65%] sm:w-[60%] max-w-[420px] h-28 sm:h-36 md:h-40'
            : isLeft
            ? 'max-w-md sm:max-w-lg h-28 sm:h-44 md:h-52 -ml-2 sm:-ml-4'
            : 'h-28 sm:h-44 md:h-56'
        } relative z-10 transition-opacity duration-500`}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />

      {/* Subtle loader placeholder while fetching */}
      {!isLoaded && (
        <div
          className={`w-full ${
            isHero
              ? 'w-[65%] sm:w-[60%] max-w-[420px] h-28 sm:h-36 md:h-40'
              : isLeft
              ? 'max-w-md h-28 sm:h-44'
              : 'h-28 sm:h-44 md:h-56'
          } flex items-center ${isLeft ? 'justify-start pl-8' : 'justify-center'}`}
        >
          <div className="w-6 h-6 border-2 border-cjerf-red/30 border-t-cjerf-red rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
