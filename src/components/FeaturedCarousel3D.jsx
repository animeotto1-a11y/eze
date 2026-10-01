import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, ChevronDown } from 'lucide-react';

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
      } else {
        // At the 4th card: let page scroll down naturally!
        // We do not prevent default or lock
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
      className="relative w-full min-h-[750px] py-16 overflow-hidden flex flex-col items-center justify-between select-none"
    >
      {/* Background Ambience Layer for current active photo */}
      {activePhoto && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <img
            key={`ambient-3d-${activePhoto.src}`}
            src={activePhoto.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 transition-all duration-700 ease-in-out"
          />
          <img
            key={`sharp-3d-${activePhoto.src}`}
            src={activePhoto.src}
            alt=""
            className="relative h-full max-h-[85vh] w-auto object-contain object-top opacity-70 transition-all duration-700 ease-in-out drop-shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/40 to-neutral-950" />
        </div>
      )}

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl px-6 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Sélection Phare — 4 Œuvres Majeures</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide">
          La Galerie <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">3D</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/60 font-light mt-1 max-w-lg mx-auto">
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
            positionStyles = '-translate-x-[160px] sm:-translate-x-[290px] md:-translate-x-[360px] scale-80 sm:scale-85 rotate-y-[22deg] opacity-70 blur-[0.5px]';
            zIndex = 20;
          } else if (offset === 1) {
            positionStyles = 'translate-x-[160px] sm:translate-x-[290px] md:translate-x-[360px] scale-80 sm:scale-85 -rotate-y-[22deg] opacity-70 blur-[0.5px]';
            zIndex = 20;
          } else if (offset === -2) {
            positionStyles = '-translate-x-[290px] sm:-translate-x-[500px] scale-65 rotate-y-[35deg] opacity-25 blur-[2px]';
            zIndex = 10;
          } else if (offset === 2) {
            positionStyles = 'translate-x-[290px] sm:translate-x-[500px] scale-65 -rotate-y-[35deg] opacity-25 blur-[2px]';
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

      {/* Floating Controls Dock */}
      <div className="relative z-10 flex flex-col items-center gap-3 mt-4 px-4">
        <div className="bg-neutral-950/80 backdrop-blur-2xl border border-amber-500/30 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black disabled:opacity-30 flex items-center justify-center transition-all cursor-pointer text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-2 text-xs font-mono text-amber-300">
            <span>Œuvre {activeIndex + 1} / 4</span>
          </div>

          <button
            onClick={handleNext}
            disabled={activeIndex === featuredPhotos.length - 1}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black disabled:opacity-30 flex items-center justify-center transition-all cursor-pointer text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll down prompt when arriving at 4th photo */}
        <button
          onClick={onScrollDown}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-500 cursor-pointer text-xs font-mono tracking-wider ${
            activeIndex === featuredPhotos.length - 1
              ? 'bg-amber-500 text-neutral-950 font-bold animate-pulse shadow-lg shadow-amber-500/30 scale-105'
              : 'text-white/50 hover:text-white'
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
