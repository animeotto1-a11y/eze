import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Sparkles, Sliders, Maximize } from 'lucide-react';

const Lightbox = ({ photo, onClose, onPrev, onNext, currentIndex, totalItems }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-6 animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="absolute top-3 left-3 right-3 sm:top-5 sm:left-6 sm:right-6 flex items-center justify-between z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{photo.categoryLabel}</span>
          </div>
          <span className="text-white/60 text-xs font-mono hidden sm:inline">
            {currentIndex + 1} sur {totalItems}
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          title="Fermer (Échap)"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Previous Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        title="Photo précédente (←)"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xl"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        title="Photo suivante (→)"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xl"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div
        className="relative max-w-full max-h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative group max-h-[75vh] sm:max-h-[82vh] overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.9)] bg-black">
          <img
            src={photo.src}
            alt={photo.title}
            className="max-h-[75vh] sm:max-h-[82vh] w-auto max-w-[92vw] object-contain transition-transform duration-500"
          />
        </div>

        {/* Bottom Metadata Card */}
        <div className="mt-3 sm:mt-4 w-full max-w-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 text-center shadow-2xl">
          <h2 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-wide">
            {photo.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-light mt-1 max-w-xl mx-auto">
            {photo.description}
          </p>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] font-mono text-amber-300/80">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              {photo.camera}
            </span>
            <span className="flex items-center gap-1.5 text-white/50">
              <Sliders className="w-3.5 h-3.5" />
              {photo.settings}
            </span>
            <span className="text-white/40">
              {photo.width} × {photo.height} px
            </span>
          </div>

          <div className="mt-2 text-[10px] uppercase tracking-widest text-white/40 font-mono">
            Studio Ezélia — « L'art à portée de main »
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
