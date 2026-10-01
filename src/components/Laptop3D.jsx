import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, ContactShadows, useGLTF, useAnimations } from '@react-three/drei';
import { LoopOnce } from 'three';
import gsap from 'gsap';
import {
  Laptop,
  Power,
  RotateCw,
  Sparkles,
  Volume2,
  VolumeX,
  Phone,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  MousePointer
} from 'lucide-react';
import LenovoBook from './r3f-portfolio/LenovoBook';
import Env from './r3f-portfolio/Env';
import RectLight from './r3f-portfolio/RectLight';
import StudioScreen from './r3f-portfolio/StudioScreen';
import useNotebook from './r3f-portfolio/useNotebook';
import Footer from './Footer';

// Inner 3D Laptop Scene leveraging lenovo-notebook.glb and GLTF animations
function LaptopScene({ lightRef, bootScreenRef, screenRef }) {
  const { nodes, materials, animations } = useGLTF('/models/lenovo-notebook.glb');
  const groupRef = useRef();
  const lenovoBookRef = useRef();

  const isOpen = useNotebook((state) => state.isOpen);
  const isPoweredOn = useNotebook((state) => state.isPoweredOn);
  const isFinishedBooting = useNotebook((state) => state.isFinishedBooting);

  const animationsObject = useAnimations(animations, groupRef);

  // Initialize laptop in open state on first render
  useEffect(() => {
    if (animationsObject?.actions?.['Open']) {
      const openAction = animationsObject.actions['Open'];
      openAction.setLoop(LoopOnce, 1);
      openAction.clampWhenFinished = true;
      openAction.play();
      // Jump to end of Open animation
      openAction.time = openAction.getClip().duration;
    }
  }, [animationsObject?.actions]);

  // Synchronize 3D opening & closing animation when Zustand isOpen state changes
  useEffect(() => {
    if (!animationsObject?.actions) return;

    if (isOpen) {
      const closeAction = animationsObject.actions['Close'];
      if (closeAction) closeAction.stop();

      const openAction = animationsObject.actions['Open'];
      if (openAction) {
        openAction.reset();
        openAction.setLoop(LoopOnce, 1);
        openAction.clampWhenFinished = true;
        openAction.play();
      }
    } else {
      const openAction = animationsObject.actions['Open'];
      if (openAction) openAction.stop();

      const closeAction = animationsObject.actions['Close'];
      if (closeAction) {
        closeAction.reset();
        closeAction.setLoop(LoopOnce, 1);
        closeAction.clampWhenFinished = true;
        closeAction.setDuration(1.6);
        closeAction.play();
      }
    }
  }, [isOpen, animationsObject?.actions]);

  return (
    <>
      <Env />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

      <PresentationControls
        global={false}
        cursor={true}
        polar={[-0.2, 0.25]}
        azimuth={[-0.7, 0.7]}
        config={{ mass: 2, tension: 350 }}
        snap={{ mass: 4, tension: 350 }}
      >
        <group ref={groupRef} position={[0, -0.2, 0]} scale={[1, 1, 1]}>
          <LenovoBook
            nodes={nodes}
            materials={materials}
            refName={lenovoBookRef}
          />
          <RectLight lightRef={lightRef} intensity={isPoweredOn && isOpen ? 2.8 : 0} />
          <StudioScreen
            isOpen={isOpen}
            isPoweredOn={isPoweredOn}
            isFinishedBooting={isFinishedBooting}
            bootScreenRef={bootScreenRef}
            screenRef={screenRef}
          />
        </group>
      </PresentationControls>

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

// Preload 3D Model
useGLTF.preload('/models/lenovo-notebook.glb');

const Laptop3D = () => {
  const lightRef = useRef();
  const bootScreenRef = useRef();
  const screenRef = useRef();

  // Audio effects
  const [bootAudio] = useState(() => new Audio('/sounds/beep.wav'));
  const [fanAudio] = useState(() => new Audio('/sounds/fan.mp3'));
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Zustand Store
  const isOpen = useNotebook((state) => state.isOpen);
  const isPoweredOn = useNotebook((state) => state.isPoweredOn);
  const isFinishedBooting = useNotebook((state) => state.isFinishedBooting);
  const openLid = useNotebook((state) => state.open);
  const closeLid = useNotebook((state) => state.close);
  const powerOn = useNotebook((state) => state.powerOn);
  const powerOff = useNotebook((state) => state.powerOff);
  const finishBooting = useNotebook((state) => state.finishBooting);

  // Sound playback helper
  const playSound = (audio) => {
    if (!soundEnabled) return;
    try {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // Toggle Lid Open/Close
  const handleToggleLid = () => {
    if (isOpen) {
      closeLid();
    } else {
      openLid();
    }
  };

  // Toggle Power On/Off
  const handleTogglePower = () => {
    if (isPoweredOn) {
      powerOff();
      if (lightRef.current) {
        gsap.to(lightRef.current, { intensity: 0, duration: 0.5 });
      }
    } else {
      playSound(bootAudio);
      playSound(fanAudio);
      powerOn();

      // Simulate system boot sequence then show Studio OS
      setTimeout(() => {
        finishBooting();
        if (lightRef.current) {
          gsap.to(lightRef.current, { intensity: 2.8, duration: 1 });
        }
      }, 3500);
    }
  };

  // Reboot sequence
  const handleReboot = () => {
    playSound(bootAudio);
    playSound(fanAudio);
    powerOff();
    setTimeout(() => {
      powerOn();
      setTimeout(() => {
        finishBooting();
      }, 3500);
    }, 400);
  };

  return (
    <section id="laptop-3d" className="relative w-full min-h-screen bg-neutral-950 text-white overflow-hidden pt-24 pb-16 flex flex-col justify-between select-none">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-neutral-950 pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-widest shadow-xl mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Projet 3D R3F Intégré • lenovo-notebook.glb</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3">
          Le Studio <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">Connecté</span>
        </h2>

        <p className="text-base sm:text-lg text-amber-100/90 font-light italic max-w-xl mx-auto">
          « L'art à portée de main » — Manipulez le modèle 3D et explorez le portfolio en direct sur l'écran.
        </p>
      </div>

      {/* Interactive Controls Bar */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3 mb-4">
        {/* Open / Close Lid */}
        <button
          onClick={handleToggleLid}
          className={`px-4 py-2 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
            isOpen
              ? 'bg-amber-500/15 border-amber-400/50 text-amber-300 hover:bg-amber-500/25'
              : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
          }`}
        >
          <Laptop className="w-4 h-4 text-amber-400" />
          <span>{isOpen ? 'Fermer le clapet' : 'Ouvrir le clapet'}</span>
        </button>

        {/* Power On / Off */}
        <button
          onClick={handleTogglePower}
          className={`px-4 py-2 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
            isPoweredOn
              ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/25'
              : 'bg-red-500/15 border-red-400/50 text-red-300 hover:bg-red-500/25'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isPoweredOn ? 'Éteindre' : 'Allumer'}</span>
        </button>

        {/* Reboot */}
        <button
          onClick={handleReboot}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <RotateCw className="w-4 h-4 text-amber-400" />
          <span>Redémarrer OS</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Sons Activés</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-neutral-400" />
              <span>Muet</span>
            </>
          )}
        </button>
      </div>

      {/* Mouse Drag Hint */}
      <div className="relative z-10 flex items-center justify-center gap-2 text-xs font-mono text-white/50 mb-2">
        <MousePointer className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        <span>Cliquez et glissez la souris pour faire pivoter l'ordinateur en 3D</span>
      </div>

      {/* 3D Canvas Stage */}
      <div className="relative w-full h-[620px] sm:h-[680px] max-w-6xl mx-auto px-4">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center text-amber-300 font-mono text-sm">
              <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
              <span>Chargement du modèle 3D lenovo-notebook.glb...</span>
            </div>
          }
        >
          <Canvas
            camera={{
              fov: 42,
              near: 0.1,
              far: 100,
              position: [0, 1.3, 5.2],
            }}
            shadows
            className="cursor-grab active:cursor-grabbing"
          >
            <LaptopScene
              lightRef={lightRef}
              bootScreenRef={bootScreenRef}
              screenRef={screenRef}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* VIP Booking & Studio Contact Card */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 mt-12 mb-16">
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
      <Footer />
    </section>
  );
};

export default Laptop3D;
