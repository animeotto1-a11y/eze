import React, { useEffect, useRef } from 'react';
import { X, Film, Volume2, Sparkles } from 'lucide-react';

const CinematicModal = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-3 sm:p-8 select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-amber-300">
          <Film className="w-5 h-5" />
          <span className="font-serif font-bold text-base sm:text-lg tracking-wider text-white">
            Studio Ezélia <span className="text-amber-400">— Teaser Cinématique</span>
          </span>
        </div>

        <button
          onClick={onClose}
          title="Fermer (Échap)"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Video Container */}
      <div
        className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_25px_90px_rgba(217,119,6,0.25)] bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src="/hero.mp4"
          controls
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-4 left-4 pointer-events-none hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs text-white/80 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>« L'art à portée de main » — Célébrations Royales & Contemporaines</span>
        </div>
      </div>
    </div>
  );
};

export default CinematicModal;
