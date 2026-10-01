import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, ContactShadows, useGLTF, useAnimations } from '@react-three/drei';
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
  ShieldCheck,
  MousePointer,
  Hand
} from 'lucide-react';
import LenovoBook from './r3f-portfolio/LenovoBook';
import Env from './r3f-portfolio/Env';
import RectLight from './r3f-portfolio/RectLight';
import StudioScreen from './r3f-portfolio/StudioScreen';
import HingeButtons from './r3f-portfolio/HingeButtons';
import PowerButtons from './r3f-portfolio/PowerButtons';
import Captions from './r3f-portfolio/Captions';
import useNotebook from './r3f-portfolio/useNotebook';
import Footer from './Footer';

// Inner 3D Laptop Scene leveraging lenovo-notebook.glb, exact side hinge button, and power button
function LaptopScene({
  lightRef,
  bootScreenRef,
  screenRef,
  openButtonRef,
  closeButtonRef,
  powerOnButtonRef,
  powerOffButtonRef,
  bootAudio,
  turnComputerFansOn,
  turnComputerFansOff,
  soundEnabled,
}) {
  const { nodes, materials, animations } = useGLTF('/models/lenovo-notebook.glb');
  const groupRef = useRef();
  const lenovoBookRef = useRef();

  const isOpen = useNotebook((state) => state.isOpen);
  const isPoweredOn = useNotebook((state) => state.isPoweredOn);
  const isFinishedBooting = useNotebook((state) => state.isFinishedBooting);
  const open = useNotebook((state) => state.open);
  const close = useNotebook((state) => state.close);
  const powerOn = useNotebook((state) => state.powerOn);
  const powerOff = useNotebook((state) => state.powerOff);
  const finishBooting = useNotebook((state) => state.finishBooting);

  const animationsObject = useAnimations(animations, groupRef);

  // Screen light helpers
  const screenLightOn = (ref) => {
    if (ref?.current) {
      gsap.to(ref.current, { intensity: 3, duration: 1 });
    }
  };

  const screenLightOff = (ref) => {
    if (ref?.current) {
      gsap.to(ref.current, { intensity: 0, duration: 0.8 });
    }
  };

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
          {/* Authentic 3D Lenovo Mesh from r3f-portfolio */}
          <LenovoBook
            nodes={nodes}
            materials={materials}
            refName={lenovoBookRef}
          />

          {/* Screen Light illuminating the keyboard */}
          <RectLight lightRef={lightRef} intensity={isPoweredOn && isOpen ? 2.8 : 0} />

          {/* Side Hinge Button to Open / Close the Laptop with GSAP & GLTF Animation */}
          <HingeButtons
            animationsObject={animationsObject}
            isOpen={isOpen}
            open={open}
            close={close}
            openButtonRef={openButtonRef}
            closeButtonRef={closeButtonRef}
            powerOnButtonRef={powerOnButtonRef}
            powerOffButtonRef={powerOffButtonRef}
            screenLightOn={screenLightOn}
            screenLightOff={screenLightOff}
            lightRef={lightRef}
            isPoweredOn={isPoweredOn}
            isFinishedBooting={isFinishedBooting}
            screenRef={screenRef}
          />

          {/* Keyboard Power Button with Sound & Boot Animation */}
          <PowerButtons
            bootAudio={bootAudio}
            turnComputerFansOn={turnComputerFansOn}
            turnComputerFansOff={turnComputerFansOff}
            powerOn={powerOn}
            powerOff={powerOff}
            finishBooting={finishBooting}
            powerOnButtonRef={powerOnButtonRef}
            powerOffButtonRef={powerOffButtonRef}
            closeButtonRef={closeButtonRef}
            screenLightOn={screenLightOn}
            screenLightOff={screenLightOff}
            lightRef={lightRef}
            screenRef={screenRef}
            soundEnabled={soundEnabled}
          />

          {/* Studio Ezélia Live Interactive Display inside the Laptop */}
          <StudioScreen
            isOpen={isOpen}
            isPoweredOn={isPoweredOn}
            isFinishedBooting={isFinishedBooting}
            bootScreenRef={bootScreenRef}
            screenRef={screenRef}
          />

          {/* Floating 3D Guided Captions in Space */}
          <Captions
            isOpen={isOpen}
            isPoweredOn={isPoweredOn}
            isFinishedBooting={isFinishedBooting}
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

  // 3D Button Refs
  const openButtonRef = useRef();
  const closeButtonRef = useRef();
  const powerOnButtonRef = useRef();
  const powerOffButtonRef = useRef();

  // Sounds
  const [bootAudio] = useState(() => new Audio('/sounds/beep.wav'));
  const [fanAudio] = useState(() => new Audio('/sounds/fan.mp3'));
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Zustand State
  const isOpen = useNotebook((state) => state.isOpen);
  const isPoweredOn = useNotebook((state) => state.isPoweredOn);
  const isFinishedBooting = useNotebook((state) => state.isFinishedBooting);

  // Fan audio management
  const turnComputerFansOn = () => {
    if (!soundEnabled) return;
    try {
      fanAudio.volume = 0;
      fanAudio.play().catch(() => {});
      const targetVolume = 0.2;
      const fadeDuration = 3000;
      const fadeInInterval = 100;
      let currentTime = 0;
      const interval = setInterval(() => {
        currentTime += fadeInInterval;
        fanAudio.volume = Math.min((currentTime / fadeDuration) * targetVolume, targetVolume);
        if (currentTime >= fadeDuration || fanAudio.volume === targetVolume) {
          clearInterval(interval);
        }
      }, fadeInInterval);
    } catch (e) {}

    setTimeout(() => {
      turnComputerFansOff();
    }, 9000);
  };

  const turnComputerFansOff = () => {
    try {
      const fadeOutInterval = 50;
      const fadeSteps = 30;
      const initialVolume = fanAudio.volume;
      let currentStep = 0;
      const volumeDecrement = initialVolume / fadeSteps;
      const interval = setInterval(() => {
        currentStep++;
        const nextVolume = initialVolume - currentStep * volumeDecrement;
        fanAudio.volume = Math.max(nextVolume, 0);
        if (currentStep >= fadeSteps || fanAudio.volume === 0) {
          clearInterval(interval);
          fanAudio.pause();
          fanAudio.volume = initialVolume;
        }
      }, fadeOutInterval);
    } catch (e) {}
  };

  // External trigger for side open/close button
  const triggerHingeClick = () => {
    if (isOpen) {
      if (closeButtonRef.current) closeButtonRef.current.click();
    } else {
      if (openButtonRef.current) openButtonRef.current.click();
    }
  };

  // External trigger for keyboard power button
  const triggerPowerClick = () => {
    if (isPoweredOn) {
      if (powerOffButtonRef.current) powerOffButtonRef.current.click();
    } else {
      if (powerOnButtonRef.current) powerOnButtonRef.current.click();
    }
  };

  return (
    <section id="laptop-3d" className="relative w-full min-h-screen bg-neutral-950 text-white overflow-hidden pt-24 pb-16 flex flex-col justify-between select-none">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-neutral-950 pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-widest shadow-xl mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Projet R3F Officiel • Animations Natives GLTF</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3">
          L'Ordinateur <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">Interactif 3D</span>
        </h2>

        <p className="text-base sm:text-lg text-amber-100/90 font-light italic max-w-xl mx-auto">
          « L'art à portée de main » — Cliquez sur le bouton latéral pour ouvrir le PC, allumez le clavier et interagissez en 3D.
        </p>
      </div>

      {/* Interactive Controls & Status Bar */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3 mb-2">
        {/* Status Clapet */}
        <button
          onClick={triggerHingeClick}
          className={`px-4 py-2 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
            isOpen
              ? 'bg-amber-500/15 border-amber-400/50 text-amber-300 hover:bg-amber-500/25'
              : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
          }`}
        >
          <Laptop className="w-4 h-4 text-amber-400" />
          <span>{isOpen ? 'Fermer le Clapet 3D' : 'Ouvrir le Clapet 3D'}</span>
        </button>

        {/* Status Power */}
        <button
          onClick={triggerPowerClick}
          disabled={!isOpen}
          className={`px-4 py-2 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
            !isOpen
              ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/10 text-neutral-400'
              : isPoweredOn
              ? 'cursor-pointer bg-emerald-500/15 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/25'
              : 'cursor-pointer bg-red-500/15 border-red-400/50 text-red-300 hover:bg-red-500/25'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isPoweredOn ? 'Éteindre' : 'Allumer'}</span>
        </button>

        {/* Audio Toggle */}
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

      {/* Interactive Helper Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white/60 mb-1 px-4">
        <span className="flex items-center gap-1.5">
          <Hand className="w-3.5 h-3.5 text-amber-400" />
          <span>Bouton clignotant sur la tranche gauche pour ouvrir</span>
        </span>
        <span className="text-white/20">•</span>
        <span className="flex items-center gap-1.5">
          <Power className="w-3.5 h-3.5 text-emerald-400" />
          <span>Touche Power sur le clavier pour allumer</span>
        </span>
        <span className="text-white/20">•</span>
        <span className="flex items-center gap-1.5">
          <MousePointer className="w-3.5 h-3.5 text-blue-400" />
          <span>Glissez la souris pour faire pivoter le PC</span>
        </span>
      </div>

      {/* 3D Canvas Stage */}
      <div className="relative w-full h-[640px] sm:h-[700px] max-w-6xl mx-auto px-4">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center text-amber-300 font-mono text-sm">
              <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
              <span>Chargement du modèle 3D interactif lenovo-notebook.glb...</span>
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
              openButtonRef={openButtonRef}
              closeButtonRef={closeButtonRef}
              powerOnButtonRef={powerOnButtonRef}
              powerOffButtonRef={powerOffButtonRef}
              bootAudio={bootAudio}
              turnComputerFansOn={turnComputerFansOn}
              turnComputerFansOff={turnComputerFansOff}
              soundEnabled={soundEnabled}
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
