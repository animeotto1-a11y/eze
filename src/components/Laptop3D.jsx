import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  Laptop,
  Power,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Phone,
  Calendar,
  ShieldCheck,
  MousePointer,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import LenovoBook from './r3f-portfolio/LenovoBook';
import Env from './r3f-portfolio/Env';
import RectLight from './r3f-portfolio/RectLight';
import StudioScreen from './r3f-portfolio/StudioScreen';
import Footer from './Footer';

// 3D Laptop Model Scene with scroll-driven smooth opening & rock-solid bounded mouse drag
function LaptopModel({
  openProgress,
  isPoweredOn,
  targetRotation,
  lightRef,
}) {
  const { nodes, materials, animations } = useGLTF('/models/lenovo-notebook.glb');
  const groupRef = useRef();
  const lenovoBookRef = useRef();
  const animationsObject = useAnimations(animations, groupRef);

  // Initialize Open animation and scrub action.time according to openProgress
  useEffect(() => {
    if (!animationsObject?.actions?.['Open']) return;
    const action = animationsObject.actions['Open'];
    action.play();
    action.paused = true;
  }, [animationsObject?.actions]);

  // Scrub animation smoothly with scroll
  useEffect(() => {
    if (!animationsObject?.actions?.['Open']) return;
    const action = animationsObject.actions['Open'];
    const clipDuration = action.getClip().duration || 1.5833;
    // Map openProgress (0 to 1) to animation time (0 to clipDuration)
    action.time = Math.min(Math.max(openProgress * clipDuration, 0), clipDuration);
  }, [openProgress, animationsObject?.actions]);

  // Smooth 60fps lerp for mouse rotation so the laptop NEVER flips or disappears
  useFrame(() => {
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

  const isFullyOpen = openProgress >= 0.85;

  return (
    <>
      <Env />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

      <group ref={groupRef} position={[0, -0.15, 0]} scale={[1, 1, 1]}>
        {/* Real Lenovo 3D Notebook Mesh */}
        <LenovoBook
          nodes={nodes}
          materials={materials}
          refName={lenovoBookRef}
        />

        {/* Ambient screen backlight illuminating keyboard */}
        <RectLight
          lightRef={lightRef}
          intensity={isPoweredOn && isFullyOpen ? 2.8 : 0}
        />

        {/* Studio Screen appears when laptop is open */}
        {isFullyOpen && (
          <StudioScreen
            isOpen={true}
            isPoweredOn={isPoweredOn}
            isFinishedBooting={true}
          />
        )}
      </group>

      <ContactShadows
        position={[0, -0.65, 0]}
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

  // Scroll and Opening States
  const [openProgress, setOpenProgress] = useState(0); // 0 (closed) to 1 (fully open)
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [showSignal, setShowSignal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const hasSignaledRef = useRef(false);

  // Mouse Drag Rotation (firmly bounded so laptop never disappears)
  const [targetRotation, setTargetRotation] = useState({ x: 0.08, y: 0 });
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  // Sound effects
  const [beepAudio] = useState(() => new Audio('/sounds/beep.wav'));
  const [fanAudio] = useState(() => new Audio('/sounds/fan.mp3'));

  // Fan sound effect when laptop powers on
  useEffect(() => {
    if (openProgress >= 0.85 && isPoweredOn && soundEnabled) {
      try {
        fanAudio.volume = 0.15;
        fanAudio.play().catch(() => {});
      } catch (e) {}
    } else {
      try {
        fanAudio.pause();
      } catch (e) {}
    }
    return () => {
      try { fanAudio.pause(); } catch (e) {}
    };
  }, [openProgress, isPoweredOn, soundEnabled]);

  // Scroll listener: progressive smooth opening until center of section + scroll buffer (1 to 5 wheel ticks)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Scrolled distance within this section
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

      // Phase 1 (0% to 45%): Progressive smooth opening (surtout pas rapidement)
      // Phase 2 (45% to 85%): Locked open at the center (1 à 5 coups de roulette de marge pour en profiter !)
      // Phase 3 (85% to 100%): Normal continuation to bottom
      let openingFraction = 0;
      if (progress < 0.45) {
        openingFraction = progress / 0.45;
      } else {
        openingFraction = 1.0;
      }

      setOpenProgress(openingFraction);

      // Haptic Vibration & Audio Signal when arriving fully open at the center
      if (openingFraction >= 0.98 && !hasSignaledRef.current) {
        hasSignaledRef.current = true;
        setShowSignal(true);

        // Haptic feedback for mobile & supporting trackpads/browsers
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([40, 60, 40]);
          } catch (e) {}
        }

        // Chime audio
        if (soundEnabled) {
          try {
            beepAudio.currentTime = 0;
            beepAudio.volume = 0.3;
            beepAudio.play().catch(() => {});
          } catch (e) {}
        }

        setTimeout(() => {
          setShowSignal(false);
        }, 3500);
      } else if (openingFraction < 0.4) {
        hasSignaledRef.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [soundEnabled]);

  // Pointer Drag Handlers (Smooth & Bounded: Yaw [-45°, +45°], Pitch [-10°, +22°])
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
      // Pitch (X-axis) strictly bounded so laptop NEVER flips or clips
      x: Math.min(Math.max(prev.x + deltaY * 0.004, -0.12), 0.35),
      // Yaw (Y-axis) bounded between -0.75 rad and +0.75 rad
      y: Math.min(Math.max(prev.y + deltaX * 0.006, -0.75), 0.75),
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
    <section ref={containerRef} id="laptop-3d" className="relative w-full h-[280vh] bg-neutral-950 text-white select-none">
      {/* Sticky Stage keeping the laptop fixed in view as user scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 px-6">
        {/* Background Ambience */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-neutral-950 pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-widest shadow-xl mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Ezélia • Expérience 3D Interactive</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2">
            L'Ordinateur <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">Connecté</span>
          </h2>

          <p className="text-sm sm:text-base text-amber-100/90 font-light italic max-w-xl mx-auto">
            « L'art à portée de main » — L'ordinateur s'ouvre progressivement avec la roulette de votre souris.
          </p>
        </div>

        {/* Dynamic Status Badges & Controls Bar */}
        <div className="relative z-20 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3">
          {/* Opening Progress Badge */}
          <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono flex items-center gap-2">
            <Laptop className="w-3.5 h-3.5 text-amber-400" />
            <span>Clapet :</span>
            <span className={openPercent >= 100 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {openPercent >= 100 ? 'Ouvert à 100%' : `${openPercent}%`}
            </span>
          </div>

          {/* Power Toggle */}
          <button
            onClick={() => setIsPoweredOn(!isPoweredOn)}
            disabled={openProgress < 0.85}
            className={`px-4 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
              openProgress < 0.85
                ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/10 text-neutral-400'
                : isPoweredOn
                ? 'cursor-pointer bg-emerald-500/15 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/25'
                : 'cursor-pointer bg-red-500/15 border-red-400/50 text-red-300 hover:bg-red-500/25'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isPoweredOn ? 'Écran Allumé' : 'Écran Éteint'}</span>
          </button>

          {/* Reset Rotation */}
          <button
            onClick={resetRotation}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Recentrer</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Son Actif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                <span>Muet</span>
              </>
            )}
          </button>
        </div>

        {/* Signal & Vibration Notification Banner */}
        <div className="relative z-30 h-8 flex items-center justify-center">
          {showSignal && (
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-amber-500/30 border border-amber-400/60 backdrop-blur-xl text-amber-200 text-xs font-mono animate-bounce shadow-2xl">
              <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>✦ Signal : Ordinateur prêt ! Faites pivoter à la souris ou interagissez sur l'écran</span>
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
                fov: 40,
                near: 0.1,
                far: 50,
                position: [0, 1.2, 5.0],
              }}
              shadows
              className="w-full h-full pointer-events-auto"
            >
              <LaptopModel
                openProgress={openProgress}
                isPoweredOn={isPoweredOn}
                targetRotation={targetRotation}
                lightRef={lightRef}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* Bottom Scroll & Interaction Prompt */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-center">
          <div className="flex items-center gap-2 text-xs font-mono text-white/50">
            <MousePointer className="w-3.5 h-3.5 text-amber-400" />
            <span>Glissez pour faire pivoter à 360° • Continuez de faire défiler pour la suite</span>
          </div>
          {openPercent >= 100 && (
            <span className="text-[11px] font-mono text-emerald-400/80">
              ✓ Clapet verrouillé ouvert • Continuez le scroll pour accéder à la réservation
            </span>
          )}
        </div>
      </div>

      {/* VIP Booking & Studio Contact Card (Appears as user scrolls past the laptop stage) */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 pt-32 pb-16">
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

        {/* Website Footer */}
        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </section>
  );
};

export default Laptop3D;
