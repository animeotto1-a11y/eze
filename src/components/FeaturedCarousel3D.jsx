import React, { useState, useRef } from 'react';
import Card from './Card';
import { ChevronLeft, ChevronRight, Sparkles, ChevronDown } from 'lucide-react';

const FeaturedCarousel3D = ({ featuredPhotos, onExpandPhoto, onScrollDown }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < featuredPhotos.length - 1 ? prev + 1 : prev));
  };

  // Wheel handling: allow scrolling inside the 4 cards,
  // but if at the end (card 3) and user scrolls down, let the page scroll naturally!
  const isScrolling = useRef(false);
  const handleWheel = (e) => {
    if (isScrolling.current) return;

    if (e.deltaY > 20) {
      if (activeIndex < featuredPhotos.length - 1) {
        // Switch to next card
        isScrolling.current = true;
        handleNext();
        setTimeout(() => {
          isScrolling.current = false;
        }, 300);
      }
    } else if (e.deltaY < -20) {
      if (activeIndex > 0) {
        isScrolling.current = true;
        handlePrev();
        setTimeout(() => {
          isScrolling.current = false;
        }, 300);
      }
    }
  };

  const activePhoto = featuredPhotos[activeIndex] || featuredPhotos[0];

  return (
    <section
      id="featured-3d"
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full min-h-[750px] py-16 overflow-hidden flex flex-col items-center justify-between select-none bg-slate-50"
    >
      {/* Background Ambience Layer for current active photo adapted to light theme */}
      {activePhoto && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <img
            key={`ambient-3d-${activePhoto.src}`}
            src={activePhoto.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-120 transition-all duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-slate-50" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-violet-400/10 blur-[140px] rounded-full pointer-events-none" />
        </div>
      )}

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl px-6 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Sélection Phare — 4 Œuvres Majeures</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
          La Galerie <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">3D</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-lg mx-auto">
          Faites défiler les 4 clichés emblématiques à la souris ou avec les flèches. Arrivé à la fin, descendez pour découvrir les 22 autres créations.
        </p>
      </div>

      {/* 3D Perspective Stage */}
      <div className="relative z-10 flex items-center justify-center w-full h-[470px] sm:h-[530px] perspective-1000 overflow-hidden my-auto">
        {featuredPhotos.map((photo, idx) => {
          const offset = idx - activeIndex;
          if (Math.abs(offset) > 2) return null;

          let positionStyles = '';
          let zIndex = 0;

          if (offset === 0) {
            positionStyles = 'translate-x-0 scale-100 rotate-y-0 opacity-100 filter-none shadow-2xl';
            zIndex = 30;
          } else if (offset === -1) {
            positionStyles = '-translate-x-[160px] sm:-translate-x-[290px] md:-translate-x-[360px] scale-80 sm:scale-85 rotate-y-[22deg] opacity-75 blur-[0.5px]';
            zIndex = 20;
          } else if (offset === 1) {
            positionStyles = 'translate-x-[160px] sm:translate-x-[290px] md:translate-x-[360px] scale-80 sm:scale-85 -rotate-y-[22deg] opacity-75 blur-[0.5px]';
            zIndex = 20;
          } else if (offset === -2) {
            positionStyles = '-translate-x-[290px] sm:-translate-x-[500px] scale-65 rotate-y-[35deg] opacity-35 blur-[2px]';
            zIndex = 10;
          } else if (offset === 2) {
            positionStyles = 'translate-x-[290px] sm:translate-x-[500px] scale-65 -rotate-y-[35deg] opacity-35 blur-[2px]';
            zIndex = 10;
          }

          return (
            <div
              key={photo.id}
              onClick={() => {
                if (offset === 0) {
                  onExpandPhoto(photo, idx);
                } else {
                  setActiveIndex(idx);
                }
              }}
              className={`absolute transition-all duration-700 ease-out cursor-pointer transform-gpu ${positionStyles}`}
              style={{ zIndex }}
            >
              <Card
                photo={photo}
                isCenter={offset === 0}
                totalItems={featuredPhotos.length}
                currentIndex={idx + 1}
                onExpand={() => onExpandPhoto(photo, idx)}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Controls Dock in Light Theme */}
      <div className="relative z-10 flex flex-col items-center gap-3 mt-4 px-4">
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-full px-4 py-2 flex items-center gap-3 shadow-xl">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-gradient-to-r hover:from-violet-600 hover:to-orange-500 hover:text-white disabled:opacity-30 flex items-center justify-center transition-all cursor-pointer text-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-2 text-xs font-mono font-bold text-violet-700">
            <span>Œuvre {activeIndex + 1} / 4</span>
          </div>

          <button
            onClick={handleNext}
            disabled={activeIndex === featuredPhotos.length - 1}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-gradient-to-r hover:from-violet-600 hover:to-orange-500 hover:text-white disabled:opacity-30 flex items-center justify-center transition-all cursor-pointer text-slate-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll down prompt when arriving at 4th photo */}
        <button
          onClick={onScrollDown}
          className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-500 cursor-pointer text-xs font-mono font-bold tracking-wider ${
            activeIndex === featuredPhotos.length - 1
              ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-500/25 scale-105 animate-pulse'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>
            {activeIndex === featuredPhotos.length - 1
              ? 'Explorer les 22 autres créations ci-dessous'
              : 'Descendre vers la suite de la collection'}
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedCarousel3D;
