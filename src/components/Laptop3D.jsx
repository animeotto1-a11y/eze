import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Laptop,
  Power,
  RotateCcw,
  Sparkles,
  Phone,
  Calendar,
  ShieldCheck,
  MousePointer,
  CheckCircle2,
  Vibrate,
  ChevronDown
} from 'lucide-react';
import LenovoBook from './r3f-portfolio/LenovoBook';
import Env from './r3f-portfolio/Env';
import RectLight from './r3f-portfolio/RectLight';
import StudioScreen from './r3f-portfolio/StudioScreen';
import Footer from './Footer';

// 3D Laptop Model Scene: direct Euler lerp on topRef for 100% reliable progressive opening
function LaptopModel({
  openProgress,
  isPoweredOn,
  onTogglePower,
  targetRotation,
  lightRef,
}) {
  const { nodes, materials } = useGLTF('/models/lenovo-notebook.glb');
  const groupRef = useRef();
  const lenovoBookRef = useRef();
  const topRef = useRef();

  // Directly lerp topRef from Math.PI (closed) to 1.358 rad (open)
  useFrame(() => {
    if (topRef.current) {
      topRef.current.rotation.x = THREE.MathUtils.lerp(Math.PI, 1.358, openProgress);
      topRef.current.position.y = THREE.MathUtils.lerp(-0.4106, -0.4718, openProgress);
    }

    // Smooth bounded rotation (Yaw [-35°, +35°], Pitch [-7°, +15°]) so laptop NEVER flips or disappears
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.x,
        0.08
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.y,
        0.08
      );
    }
  });

  return (
    <>
      <Env />
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />

      {/* LOWERED LAPTOP POSITION: position={[0, -0.72, 0]} so screen top never touches header */}
      <group ref={groupRef} position={[0, -0.72, 0]} scale={[1, 1, 1]}>
        {/* Real Lenovo 3D Notebook Mesh with topRef for direct progressive lid rotation */}
        <LenovoBook
          nodes={nodes}
          materials={materials}
          refName={lenovoBookRef}
          topRef={topRef}
        />

        {/* Ambient screen glow on keyboard when powered on and open */}
        <RectLight
          lightRef={lightRef}
          intensity={isPoweredOn && openProgress >= 0.85 ? 3.2 : 0}
        />

        {/* Authentic Studio Screen inside laptop lid: Binary boot then Eze Otto Facebook Profile */}
        {openProgress >= 0.82 && (
          <StudioScreen
            isPoweredOn={isPoweredOn}
            onTogglePower={onTogglePower}
          />
        )}

        {/* Physical 3D Power Button on the Laptop Keyboard Deck (UPPER-LEFT SIDE ONLY) */}
        {openProgress >= 0.6 && (
          <Html
            position={[-1.15, 0.52, -0.98]}
            rotation={[-Math.PI / 2.3, 0, 0]}
            transform
            distanceFactor={1.1}
            className="select-none pointer-events-auto"
          >
            <div className="relative group">
              <button
                onClick={onTogglePower}
                className={`p-2.5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isPoweredOn
                    ? 'bg-emerald-500 border-emerald-300 text-white scale-100 hover:scale-110 shadow-emerald-500/50'
                    : 'bg-gradient-to-r from-violet-600 to-orange-500 border-white text-white animate-pulse scale-110 hover:scale-125 shadow-violet-500/50'
                }`}
                title={isPoweredOn ? "Éteindre l'ordinateur" : "Allumer l'ordinateur"}
              >
                <Power className="w-4 h-4 font-bold" />
              </button>

              {/* Status Badge Floating above the power button on the keyboard */}
              <div
                onClick={onTogglePower}
                className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider cursor-pointer border shadow-lg flex items-center gap-1.5 transition-all ${
                  isPoweredOn
                    ? 'bg-slate-900 border-emerald-400 text-emerald-400 shadow-emerald-500/20'
                    : 'bg-slate-900 border-violet-400 text-violet-200 animate-bounce shadow-violet-500/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isPoweredOn ? 'bg-emerald-400' : 'bg-orange-400 animate-ping'}`} />
                <span>{isPoweredOn ? 'ALLUMÉ • ÉTEINDRE' : '⚡ ALLUMER LE PC'}</span>
              </div>
            </div>
          </Html>
        )}
      </group>

      <ContactShadows
        position={[0, -1.20, 0]}
        opacity={0.25}
        scale={8.8}
        blur={1.8}
        color="#0f172a"
      />
    </>
  );
}

useGLTF.preload('/models/lenovo-notebook.glb');

const Laptop3D = () => {
  const containerRef = useRef(null);
  const lightRef = useRef();

  // Scroll Progress: 0 (closed) -> 1 (fully open)
  const [openProgress, setOpenProgress] = useState(0);
  const [isPoweredOn, setIsPoweredOn] = useState(false); // Starts powered off
  const [isVibrating, setIsVibrating] = useState(false);
  const [showVibrationAlert, setShowVibrationAlert] = useState(false);
  const hasTriggeredVibrationRef = useRef(false);

  // Mouse Drag Rotation (strictly bounded so laptop NEVER disappears)
  const [targetRotation, setTargetRotation] = useState({ x: 0.08, y: 0 });
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  const togglePower = () => {
    setIsPoweredOn((prev) => !prev);
  };

  // Scroll listener: slow gradual opening until 50% scroll, THEN STAYS 100% OPEN FOR EVER AS YOU SCROLL DOWN
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = scrolled / totalScrollable;

      let openingFraction = 0;
      if (progress <= 0) {
        openingFraction = 0;
      } else if (progress < 0.50) {
        openingFraction = progress / 0.50;
      } else {
        openingFraction = 1.0;
      }

      setOpenProgress(openingFraction);

      // Trigger Physical Haptic & Visual Vibration tremor when reaching 100% open
      if (openingFraction >= 0.98 && !hasTriggeredVibrationRef.current) {
        hasTriggeredVibrationRef.current = true;
        setIsVibrating(true);
        setShowVibrationAlert(true);

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([80, 100, 80, 100, 150]);
          } catch (e) {}
        }

        setTimeout(() => {
          setIsVibrating(false);
        }, 700);

        setTimeout(() => {
          setShowVibrationAlert(false);
        }, 4500);
      } else if (openingFraction < 0.25) {
        hasTriggeredVibrationRef.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse Drag Handlers: Strict bounding so laptop stays rock-solid
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevPointerRef.current.x;
    const deltaY = e.clientY - prevPointerRef.current.y;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };

    setTargetRotation((prev) => ({
      x: Math.min(Math.max(prev.x + deltaY * 0.003, -0.10), 0.25),
      y: Math.min(Math.max(prev.y + deltaX * 0.005, -0.60), 0.60),
    }));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const resetRotation = () => {
    setTargetRotation({ x: 0.08, y: 0 });
  };

  const openPercent = Math.round(openProgress * 100);

  return (
    <div className="w-full bg-slate-50">
      {/* 1. DEDICATED SCROLL TRACK FOR 3D LAPTOP (450vh) */}
      <section
        ref={containerRef}
        id="laptop-3d"
        className="relative w-full h-[450vh] bg-slate-50 text-slate-900 select-none"
      >
        {/* Sticky Fullscreen Stage: Pure, clean 3D laptop product experience in Light Theme */}
        <div
          className={`sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-6 pb-4 px-6 transition-transform ${
            isVibrating ? 'animate-vibrate' : ''
          }`}
        >
          {/* Background Ambience with Soft EternaCloud Tones */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-violet-400/10 blur-[160px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-orange-400/10 blur-[150px] pointer-events-none rounded-full" />

          {/* Section Header */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-50 border border-violet-200/90 text-violet-700 text-[11px] font-semibold uppercase tracking-wider shadow-sm mb-1.5">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>Studio Ezélia • Modèle 3D Pur</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 mb-1">
              L'Ordinateur <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">Connecté</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto">
              « L'art à portée de main » — Faites défiler la molette lentement pour ouvrir l'ordinateur en 3D.
            </p>
          </div>

          {/* Clean Status & Recenter Row (NO duplicate power button: only on the keyboard deck) */}
          <div className="relative z-20 max-w-xl mx-auto flex items-center justify-center gap-3">
            {/* Clapet State Badge */}
            <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-mono font-medium flex items-center gap-2 shadow-sm">
              <Laptop className="w-3.5 h-3.5 text-violet-600" />
              <span>Clapet :</span>
              <span className={openPercent >= 100 ? 'text-emerald-600 font-bold' : 'text-orange-500 font-bold'}>
                {openPercent >= 100 ? 'Ouvert à 100%' : `${openPercent}% (en cours d'ouverture...)`}
              </span>
            </div>

            {/* Recenter Button */}
            <button
              onClick={resetRotation}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-violet-600" />
              <span>Recentrer 3D</span>
            </button>
          </div>

          {/* Vibration Alert Banner */}
          <div className="relative z-30 h-8 flex items-center justify-center">
            {showVibrationAlert && (
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/95 border-2 border-violet-400 backdrop-blur-xl text-violet-800 text-xs font-mono font-bold shadow-xl animate-bounce">
                <Vibrate className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>📳 ALERTE VIBRATION : L'ordinateur est 100% ouvert !</span>
              </div>
            )}
          </div>

          {/* Pure 3D Canvas */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative w-full flex-1 max-w-5xl mx-auto cursor-grab active:cursor-grabbing flex items-center justify-center min-h-[460px] max-h-[620px]"
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center text-violet-600 font-mono text-sm">
                  <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <span>Chargement du modèle 3D...</span>
                </div>
              }
            >
              <Canvas
                camera={{
                  fov: 38,
                  near: 0.1,
                  far: 100,
                  position: [0, 0.95, 4.6],
                }}
                shadows
                className="w-full h-full pointer-events-auto"
              >
                <LaptopModel
                  openProgress={openProgress}
                  isPoweredOn={isPoweredOn}
                  onTogglePower={togglePower}
                  targetRotation={targetRotation}
                  lightRef={lightRef}
                />
              </Canvas>
            </Suspense>
          </div>

          {/* Bottom Interaction Guide */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-center pb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MousePointer className="w-3.5 h-3.5 text-violet-600" />
              <span>Glissez à la souris pour faire pivoter • Bouton POWER sur le coin supérieur gauche du clavier</span>
            </div>
            {openPercent >= 100 ? (
              <span className="text-[11px] font-mono font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>L'ordinateur reste grand ouvert • Cliquez sur l'écran pour visiter la page Facebook</span>
              </span>
            ) : (
              <span className="text-[11px] font-mono font-medium text-orange-500 flex items-center gap-1">
                <ChevronDown className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
                <span>Faites rouler la molette lentement vers le bas pour ouvrir le PC...</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. VIP BOOKING & FOOTER SECTION in Light Luxury Card Style */}
      <div className="relative z-30 w-full bg-slate-50 py-24 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-200 text-xs font-semibold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span>Réservations VIP Saison 2026</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-4xl font-black text-slate-950 mb-2">
                  Sublimez Votre Grand Jour
                </h3>
                <p className="text-slate-600 text-sm max-w-md leading-relaxed font-normal">
                  Mariages d'exception, portraits impériaux et célébrations prestigieuses. Un accompagnement sur mesure pour immortaliser vos plus précieux instants.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <a
                  href="https://wa.me/2250700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Réserver une Séance</span>
                </a>

                <a
                  href="tel:+2250700000000"
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-violet-600" />
                  <span>+225 07 00 00 00 00</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Website Footer */}
        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Laptop3D;
