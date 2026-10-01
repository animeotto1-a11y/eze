import React, { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { Power, ExternalLink } from 'lucide-react';

// Matrix / Hacker Binary Stream Boot Animation
function BinaryBootScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [binaryLines, setBinaryLines] = useState([]);
  const [activeLog, setActiveLog] = useState('INITIALIZING...');

  // Generate continuous streaming binary chunks
  useEffect(() => {
    const chars = '01';
    const generateBinaryChunk = () => {
      let chunk = '';
      for (let i = 0; i < 32; i++) {
        chunk += chars[Math.floor(Math.random() * chars.length)];
        if ((i + 1) % 8 === 0 && i !== 31) chunk += ' ';
      }
      return chunk;
    };

    const initialLines = Array.from({ length: 12 }, () => generateBinaryChunk());
    setBinaryLines(initialLines);

    const streamInterval = setInterval(() => {
      setBinaryLines((prev) => {
        const next = [...prev.slice(1), generateBinaryChunk()];
        return next;
      });
    }, 70);

    return () => clearInterval(streamInterval);
  }, []);

  // Timed boot steps and progress bar
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2600; // 2.6 seconds of intense binary cyber boot

    const steps = [
      { t: 0.1, text: 'BIOS BOOT // STUDIO EZÉLIA QUANTUM KERNEL' },
      { t: 0.25, text: 'ALLOCATING 64GB DDR5 UNIFIED BUFFER... [ OK ]' },
      { t: 0.45, text: 'DECODING PROFILE BINARY: 01000101 01111010 01100101...' },
      { t: 0.65, text: 'IDENTITY RESOLVED: EZE OTTO [PHOTOGRAPHE & INFOGRAPHE]' },
      { t: 0.82, text: 'CONNECTING: https://web.facebook.com/ottoezechiel/' },
      { t: 0.95, text: 'HANDSHAKE 200 OK • RENDERING FACEBOOK VIEWPORT...' },
    ];

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      const currentStep = [...steps].reverse().find((s) => pct / 100 >= s.t);
      if (currentStep) {
        setActiveLog(currentStep.text);
      }

      if (elapsed >= duration) {
        clearInterval(timer);
        onComplete();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-[#030704] text-emerald-400 font-mono flex flex-col justify-between p-12 relative overflow-hidden select-none">
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/80 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px)',
        }}
      />

      {/* Top Cyber Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-emerald-500/30 pb-6 text-xl">
        <div className="flex items-center gap-4">
          <span className="w-4 h-4 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span className="font-bold tracking-widest text-emerald-300">
            STUDIO EZÉLIA // BINARY DECODER v4.2
          </span>
        </div>
        <div className="text-amber-400 text-lg">
          SECURE PROTOCOL • 1024-BIT CIPHER
        </div>
      </div>

      {/* Center Matrix Code Cascades */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-6 space-y-3 font-mono">
        <div className="text-emerald-500/60 text-lg tracking-widest">
          // STREAMING BINARY BUFFER (ASCII EZE OTTO):
        </div>

        <div className="bg-black/70 border border-emerald-500/30 rounded-xl p-8 backdrop-blur-md shadow-2xl space-y-2">
          {binaryLines.map((line, idx) => (
            <div
              key={idx}
              className={`text-2xl tracking-widest font-bold transition-opacity ${
                idx === binaryLines.length - 1
                  ? 'text-white drop-shadow-[0_0_12px_#10b981]'
                  : idx >= binaryLines.length - 3
                  ? 'text-emerald-300'
                  : 'text-emerald-600/70'
              }`}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Real-time Status Log */}
        <div className="text-xl text-amber-300 font-semibold tracking-wide flex items-center gap-3 pt-2">
          <span className="text-emerald-400">&gt;</span>
          <span>{activeLog}</span>
          <span className="w-3 h-5 bg-emerald-400 animate-pulse inline-block" />
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between text-lg text-emerald-300/80">
          <span>DÉCODAGE DU PROFIL FACEBOOK EN COURS...</span>
          <span className="font-bold text-emerald-400">{progress}%</span>
        </div>
        <div className="w-full h-4 bg-neutral-900 rounded-full overflow-hidden border border-emerald-500/40 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-75 shadow-[0_0_15px_#10b981]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Eze Otto Facebook Profile View
function FacebookScreenView() {
  const fbProfileUrl =
    'https://web.facebook.com/ottoezechiel/?_rdc=1&_rdr#';

  return (
    <div className="w-full h-full bg-[#18191a] text-white flex flex-col font-sans select-none overflow-hidden relative">
      {/* 1. Realistic Chrome / Facebook Browser Window Bar */}
      <div className="h-16 bg-[#242526] border-b border-white/10 px-8 flex items-center justify-between text-base z-20">
        {/* Window controls */}
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#ff5f56]" />
          <div className="w-4 h-4 rounded-full bg-[#ffbd2e]" />
          <div className="w-4 h-4 rounded-full bg-[#27c93f]" />
        </div>

        {/* Browser Tab */}
        <div className="flex items-center gap-3 px-6 py-2 bg-[#18191a] rounded-t-xl border-t-2 border-[#1877f2] text-white font-medium text-base shadow-lg">
          <div className="w-5 h-5 rounded-full bg-[#1877f2] text-white flex items-center justify-center font-bold text-xs">
            f
          </div>
          <span className="tracking-wide">Eze Otto | Facebook</span>
        </div>

        {/* Address URL Bar */}
        <div className="flex-1 max-w-2xl mx-8 px-6 py-2 bg-[#3a3b3c] rounded-full text-sm font-mono text-neutral-200 flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-2 truncate">
            <span className="text-emerald-400 text-xs">🔒</span>
            <span className="truncate">web.facebook.com/ottoezechiel/?_rdc=1&_rdr#</span>
          </div>
          <ExternalLink className="w-4 h-4 text-neutral-400 flex-shrink-0" />
        </div>

        {/* Connected state */}
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span>EN LIGNE</span>
        </div>
      </div>

      {/* 2. Main Facebook Profile Screenshot Body */}
      <div className="relative flex-1 bg-[#18191a] overflow-hidden flex items-start justify-center">
        <img
          src="/images/facebook-eze-otto.png"
          alt="Profil Facebook Eze Otto"
          className="w-full h-full object-cover object-top pointer-events-none"
        />

        {/* 3. INVISIBLE FULLSCREEN LINK: Clicking anywhere on the screen opens Facebook in a new window */}
        <a
          href={fbProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-50 cursor-pointer block group"
          title="Ouvrir la page Facebook de Eze Otto dans une nouvelle fenêtre"
        >
          {/* Subtle Hover Pill Badge */}
          <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-3 bg-[#1877F2] hover:bg-[#166fe5] text-white text-lg font-semibold px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/25 backdrop-blur-md">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Ouvrir la page Facebook officielle (Eze Otto) ↗</span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default function StudioScreen({
  isPoweredOn,
  onTogglePower,
}) {
  const [bootPhase, setBootPhase] = useState('off'); // 'off' | 'binary' | 'facebook'

  // Sync bootPhase with isPoweredOn
  useEffect(() => {
    if (isPoweredOn) {
      setBootPhase('binary');
    } else {
      setBootPhase('off');
    }
  }, [isPoweredOn]);

  const handleBinaryComplete = () => {
    setBootPhase('facebook');
  };

  return (
    <Html
      transform
      distanceFactor={0.60}
      position={[0.0, 1.585, -1.575]}
      rotation-x={-0.256}
      className="select-none pointer-events-auto"
    >
      <div className="w-[2070px] h-[1300px] bg-black text-white rounded-[22px] overflow-hidden flex flex-col font-sans border-2 border-neutral-800 shadow-2xl relative">
        {/* If screen is powered OFF: sleek black glass standby mode */}
        {!isPoweredOn && (
          <div
            onClick={onTogglePower}
            className="w-full h-full bg-[#050505] flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-neutral-950 group relative"
          >
            <div className="w-28 h-28 rounded-full bg-amber-500/10 border-2 border-amber-400/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-amber-400 transition-all shadow-2xl shadow-amber-500/20">
              <Power className="w-14 h-14 text-amber-400 animate-pulse" />
            </div>
            <h3 className="font-serif text-4xl font-bold text-white mb-2 tracking-wide">
              Studio Ezélia • Ordinateur en Veille
            </h3>
            <p className="text-amber-300 text-xl font-mono">
              Appuyez sur le bouton POWER (en haut à gauche du clavier) pour allumer
            </p>
          </div>
        )}

        {/* If screen is powered ON & in Binary Boot Phase */}
        {isPoweredOn && bootPhase === 'binary' && (
          <BinaryBootScreen onComplete={handleBinaryComplete} />
        )}

        {/* If screen is powered ON & Boot is Complete: Eze Otto Facebook Screen */}
        {isPoweredOn && bootPhase === 'facebook' && (
          <FacebookScreenView />
        )}
      </div>
    </Html>
  );
}
