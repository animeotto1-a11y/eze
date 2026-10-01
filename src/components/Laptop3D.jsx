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

// Quaternion values extracted directly from the GLTF Open animation
// Start: Closed flat on chassis; End: Open upright at ~110°
const qClosed = new THREE.Quaternion(-1.0, 0, 0, 0.0013);
const qOpen = new THREE.Quaternion(0.6279, 0, 0, 0.7783);
const pClosed = new THREE.Vector3(0.0075, -0.4106, -10.4124);
const pOpen = new THREE.Vector3(0.0075, -0.4718, -10.4124);

// 3D Laptop Model Scene: direct quaternion slerp for 100% reliable opening & rock-solid mouse drag
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

  // Directly slerp the Top node so it NEVER loops, NEVER snaps shut, and stays open permanently
  useFrame(() => {
    if (nodes?.Top) {
      nodes.Top.quaternion.slerpQuaternions(qClosed, qOpen, openProgress);
      nodes.Top.position.lerpVectors(pClosed, pOpen, openProgress);
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

  const isScreenVisible = openProgress >= 0.92;

  return (
    <>
      <Env />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.3} castShadow />

      <group ref={groupRef} position={[0, -0.2, 0]} scale={[1, 1, 1]}>
        {/* Real Lenovo 3D Notebook Mesh */}
        <LenovoBook
          nodes={nodes}
          materials={materials}
          refName={lenovoBookRef}
        />

        {/* Ambient screen glow on keyboard */}
        <RectLight
          lightRef={lightRef}
          intensity={isPoweredOn && isScreenVisible ? 2.8 : 0}
        />

        {/* Studio Screen displays ONLY when lid is fully open at ~110° */}
        {isScreenVisible && (
          <StudioScreen
            isPoweredOn={isPoweredOn}
            onTogglePower={onTogglePower}
          />
        )}

        {/* Physical 3D Power Button on Keyboard Deck */}
        {openProgress >= 0.8 && (
          <Html
            position={[1.15, 0.52, -0.98]}
            rotation={[-Math.PI / 2.3, 0, 0]}
            transform
            distanceFactor={1.2}
            className="select-none pointer-events-auto"
          >
            <button
              onClick={onTogglePower}
              className={`p-2 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                isPoweredOn
                  ? 'bg-emerald-500 border-emerald-300 text-neutral-950 scale-100 hover:scale-110'
                  : 'bg-amber-500 border-amber-300 text-neutral-950 animate-pulse scale-110 hover:scale-125'
              }`}
              title={isPoweredOn ? 'Éteindre le PC' : 'Allumer le PC'}
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          </Html>
        )}
      </group>

      <ContactShadows
        position={[0, -0.68, 0]}
        opacity={0.45}
        scale={8}
        blur={1.4}
        color="#000000"
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
  const [isPoweredOn, setIsPoweredOn] = useState(true);
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
        // Slow, gradual opening across the first 50% of the long 450vh track
        openingFraction = progress / 0.50;
      } else {
        // Once past 50%, IT STAYS 100% OPEN! It NEVER closes as you scroll down!
        // It only closes when you scroll back up past 50%!
        openingFraction = 1.0;
      }

      setOpenProgress(openingFraction);

      // Trigger Physical Haptic & Visual Vibration tremor when reaching 100% open
      if (openingFraction >= 0.98 && !hasTriggeredVibrationRef.current) {
        hasTriggeredVibrationRef.current = true;
        setIsVibrating(true);
        setShowVibrationAlert(true);

        // Native device vibration (phones, tablets, supported devices)
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([80, 100, 80, 100, 150]);
          } catch (e) {}
        }

        // Auto-stop tremor effect after 650ms
        setTimeout(() => {
          setIsVibrating(false);
        }, 700);

        // Keep visual alert banner for 4 seconds
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
      // Pitch (X-axis) strictly bounded [-0.10, +0.25]
      x: Math.min(Math.max(prev.x + deltaY * 0.003, -0.10), 0.25),
      // Yaw (Y-axis) strictly bounded [-0.60, +0.60]
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
    <div className="w-full bg-neutral-950">
      {/* 1. DEDICATED SCROLL TRACK FOR 3D LAPTOP (450vh) */}
      <section
        ref={containerRef}
        id="laptop-3d"
        className="relative w-full h-[450vh] bg-neutral-950 text-white select-none"
      >
        {/* Sticky Fullscreen Stage: Keeps only the 3D laptop in view until completely finished */}
        <div
          className={`sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-10 px-6 transition-transform ${
            isVibrating ? 'animate-vibrate' : ''
          }`}
        >
          {/* Background Ambience */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-amber-500/10 blur-[160px] pointer-events-none rounded-full" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/50 to-neutral-950 pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-widest shadow-xl mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Studio Ezélia • Expérience 3D Interactive</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2">
              L'Ordinateur <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">Connecté</span>
            </h2>

            <p className="text-sm sm:text-base text-amber-100/90 font-light italic max-w-xl mx-auto">
              « L'art à portée de main » — Faites défiler la molette lentement pour ouvrir l'ordinateur.
            </p>
          </div>

          {/* Prominent Controls Bar with HIGH-VISIBILITY Power Button */}
          <div className="relative z-20 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3">
            {/* Clapet State Badge */}
            <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono flex items-center gap-2 shadow-lg">
              <Laptop className="w-4 h-4 text-amber-400" />
              <span>Clapet :</span>
              <span className={openPercent >= 100 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {openPercent >= 100 ? 'Ouvert à 100%' : `${openPercent}% (en cours d'ouverture...)`}
              </span>
            </div>

            {/* VERY CLEAR, LARGE BUTTON TO TURN COMPUTER SCREEN ON/OFF */}
            <button
              onClick={togglePower}
              className={`px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-xl cursor-pointer ${
                isPoweredOn
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shadow-emerald-500/30 ring-2 ring-emerald-400/60'
                  : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold shadow-amber-500/40 animate-pulse ring-2 ring-amber-400/60'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isPoweredOn ? '⚡ ÉCRAN ALLUMÉ (Cliquer pour éteindre)' : '⚡ ALLUMER L\'ORDINATEUR'}</span>
            </button>

            {/* Recenter Button */}
            <button
              onClick={resetRotation}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Recentrer 3D</span>
            </button>
          </div>

          {/* Vibration Alert Banner */}
          <div className="relative z-30 h-10 flex items-center justify-center">
            {showVibrationAlert && (
              <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-amber-500/30 border-2 border-amber-400/80 backdrop-blur-xl text-amber-200 text-xs font-mono shadow-2xl animate-bounce">
                <Vibrate className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>📳 ALERTE VIBRATION : Ordinateur ouvert à 100% & Écran Connecté !</span>
              </div>
            )}
          </div>

          {/* 3D Canvas with safe, bounded mouse drag */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative w-full h-[520px] sm:h-[580px] max-w-5xl mx-auto cursor-grab active:cursor-grabbing flex items-center justify-center"
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-300 font-mono text-sm">
                  <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <span>Chargement du modèle 3D...</span>
                </div>
              }
            >
              <Canvas
                camera={{
                  fov: 38,
                  near: 0.1,
                  far: 100,
                  position: [0, 1.1, 4.8],
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
          <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-center">
            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
              <MousePointer className="w-3.5 h-3.5 text-amber-400" />
              <span>Glissez à la souris pour faire pivoter à 360° sans quitter l'écran</span>
            </div>
            {openPercent >= 100 ? (
              <span className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>L'ordinateur reste grand ouvert • Faites défiler pour accéder à la réservation VIP</span>
              </span>
            ) : (
              <span className="text-[11px] font-mono text-amber-300/70 flex items-center gap-1">
                <ChevronDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>Faites rouler la molette lentement vers le bas pour ouvrir le PC...</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. COMPLETELY SEPARATE VIP BOOKING & FOOTER SECTION (Positioned BELOW the 450vh stage so it CANNOT overlap!) */}
      <div className="relative z-30 w-full bg-neutral-950 py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-amber-500/30 p-8 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Réservations VIP Saison 2026</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-2">
                  Sublimez Votre Grand Jour
                </h3>
                <p className="text-neutral-300 text-sm max-w-md leading-relaxed">
                  Mariages d'exception, portraits impériaux et célébrations prestigieuses. Un accompagnement sur mesure pour immortaliser vos plus précieux instants.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <a
                  href="https://wa.me/2250700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-neutral-950 font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Réserver une Séance</span>
                </a>

                <a
                  href="tel:+2250700000000"
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
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
