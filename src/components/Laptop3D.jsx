import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCcw, Monitor, Camera, Phone, Mail } from 'lucide-react';

const Laptop3D = ({ photos }) => {
  const mountRef = useRef(null);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  // References for three.js scene manipulation
  const sceneRef = useRef(null);
  const laptopGroupRef = useRef(null);
  const screenCanvasRef = useRef(null);
  const screenTextureRef = useRef(null);

  // Cycle photos on laptop screen
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreenIndex((prev) => (prev + 1) % photos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [photos.length]);

  // Update canvas texture whenever currentScreenIndex changes
  useEffect(() => {
    if (!screenCanvasRef.current || !screenTextureRef.current) return;
    const canvas = screenCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const photo = photos[currentScreenIndex];

    if (!photo) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photo.src;
    img.onload = () => {
      // Draw background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw photo with cover
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio
      );

      // Dark gradient overlay
      const gradient = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top Glass Nav on Laptop Screen
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, 50);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 20px "Cinzel", Georgia, serif';
      ctx.fillText('STUDIO EZÉLIA', 24, 32);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '14px sans-serif';
      ctx.fillText('« L\'art à portée de main »', canvas.width - 240, 32);

      // Bottom Photo Details
      ctx.fillStyle = '#fde68a';
      ctx.font = '14px monospace';
      ctx.fillText(`COLLECTION: ${photo.categoryLabel.toUpperCase()}`, 30, canvas.height - 70);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Cinzel", Georgia, serif';
      ctx.fillText(photo.title, 30, canvas.height - 35);

      screenTextureRef.current.needsUpdate = true;
    };
  }, [currentScreenIndex, photos]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xf59e0b, 2.5);
    goldKeyLight.position.set(4, 5, 4);
    goldKeyLight.castShadow = true;
    scene.add(goldKeyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // 3. Laptop Screen Texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    screenCanvasRef.current = canvas;

    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTextureRef.current = screenTexture;

    // 4. Build Laptop 3D Model
    const laptopGroup = new THREE.Group();
    laptopGroupRef.current = laptopGroup;
    scene.add(laptopGroup);

    // Materials
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2128,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkPlasticMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f1115,
      metalness: 0.3,
      roughness: 0.7,
    });

    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });

    // Base Chassis
    const baseWidth = 3.2;
    const baseDepth = 2.1;
    const baseHeight = 0.08;

    const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const baseMesh = new THREE.Mesh(baseGeometry, metalMaterial);
    baseMesh.position.y = -baseHeight / 2;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    laptopGroup.add(baseMesh);

    // Keyboard Area
    const keyboardGeometry = new THREE.BoxGeometry(2.7, 0.02, 1.1);
    const keyboardMesh = new THREE.Mesh(keyboardGeometry, darkPlasticMaterial);
    keyboardMesh.position.set(0, 0.005, -0.25);
    laptopGroup.add(keyboardMesh);

    // Trackpad
    const trackpadGeometry = new THREE.BoxGeometry(1.0, 0.01, 0.65);
    const trackpadMaterial = new THREE.MeshStandardMaterial({
      color: 0x272a33,
      metalness: 0.5,
      roughness: 0.3,
    });
    const trackpadMesh = new THREE.Mesh(trackpadGeometry, trackpadMaterial);
    trackpadMesh.position.set(0, 0.005, 0.65);
    laptopGroup.add(trackpadMesh);

    // Screen Lid (Hinged at back)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0, -baseDepth / 2);
    // Open angle (~110 degrees)
    lidGroup.rotation.x = -Math.PI / 2 + 0.32;
    laptopGroup.add(lidGroup);

    // Lid Frame
    const lidHeight = 2.1;
    const lidGeometry = new THREE.BoxGeometry(baseWidth, lidHeight, 0.05);
    const lidMesh = new THREE.Mesh(lidGeometry, metalMaterial);
    lidMesh.position.set(0, lidHeight / 2, -0.025);
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Screen Display Plane
    const screenDisplayGeometry = new THREE.PlaneGeometry(3.0, 1.9);
    const screenDisplayMesh = new THREE.Mesh(screenDisplayGeometry, screenMaterial);
    screenDisplayMesh.position.set(0, lidHeight / 2, 0.002);
    lidGroup.add(screenDisplayMesh);

    // Golden Royal Logo on Lid Back
    const logoBackGeometry = new THREE.CircleGeometry(0.18, 32);
    const logoBackMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x92400e,
      emissiveIntensity: 0.3,
    });
    const logoBackMesh = new THREE.Mesh(logoBackGeometry, logoBackMaterial);
    logoBackMesh.position.set(0, lidHeight / 2, -0.052);
    logoBackMesh.rotation.y = Math.PI;
    lidGroup.add(logoBackMesh);

    // Ground Shadow Plate
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.6;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // Mouse Parallax & Drag Handling
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        mouseX = x;
        mouseY = y;
      }
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating levitation
      laptopGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08 - 0.1;

      // Smooth rotation towards mouse
      if (!isDragging) {
        targetRotationY = mouseX * 0.45;
        targetRotationX = -mouseY * 0.25;
      }

      laptopGroup.rotation.y += (targetRotationY - laptopGroup.rotation.y) * 0.08;
      laptopGroup.rotation.x += (targetRotationX - laptopGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      if (mount) {
        mount.removeEventListener('mousemove', handleMouseMove);
        mount.removeEventListener('mousedown', handleMouseDown);
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section id="laptop-3d-experience" className="relative w-full py-24 px-6 bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white overflow-hidden select-none">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Expérience 3D Interactive — Comme sur r3f-portfolio</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Le Studio sur Votre <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">Écran</span>
        </h2>

        <p className="text-sm sm:text-base text-white/60 font-light mt-2 max-w-lg mx-auto">
          Faites pivoter l'ordinateur 3D à la souris. L'écran diffuse en continu les créations du Studio Ezélia.
        </p>
      </div>

      {/* 3D Canvas Mount */}
      <div className="relative max-w-4xl h-[460px] sm:h-[540px] mx-auto cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Screen Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/15 px-4 py-2 rounded-full shadow-2xl">
          <button
            onClick={() => setCurrentScreenIndex((prev) => (prev + 1) % photos.length)}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-white transition-colors cursor-pointer font-mono"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Changer d'image sur l'écran</span>
          </button>
          <span className="text-white/20">|</span>
          <span className="text-[11px] text-white/50 font-mono">
            Glissez pour tourner à 360°
          </span>
        </div>
      </div>

      {/* Final Landing CTA & Contact (On s'arrête là) */}
      <div className="max-w-3xl mx-auto mt-16 text-center border-t border-white/10 pt-12">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
          Donnez Vie à Vos Plus Beaux Souvenirs
        </h3>
        <p className="text-amber-200/80 italic text-base sm:text-lg font-light mb-6">
          « L'art à portée de main »
        </p>
        <p className="text-xs sm:text-sm text-white/60 font-light max-w-md mx-auto mb-8 leading-relaxed">
          Que ce soit pour célébrer votre alliance royale, une cérémonie civile ou un portrait d'art, confiez votre journée à Studio Ezélia.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Réserver un Shooting (WhatsApp)</span>
          </a>

          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>contact@studio-ezelia.com</span>
          </div>
        </div>

        <div className="mt-12 text-[11px] font-mono text-white/30">
          STUDIO EZÉLIA · TOUS DROITS RÉSERVÉS · {new Date().getFullYear()}
        </div>
      </div>
    </section>
  );
};

export default Laptop3D;
