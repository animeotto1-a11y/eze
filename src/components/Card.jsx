import React from 'react';
import { Maximize2, Camera, Sparkles } from 'lucide-react';

const Card = ({ photo, isCenter, totalItems, currentIndex, onExpand }) => {
  const handleCardClick = (e) => {
    if (isCenter) {
      e.stopPropagation();
      onExpand(photo);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative rounded-3xl overflow-hidden transition-all duration-500 select-none group ${
        isCenter
          ? 'w-[320px] sm:w-[380px] h-[490px] sm:h-[530px] border-2 border-violet-500/80 shadow-[0_30px_70px_-15px_rgba(124,58,237,0.45)] ring-4 ring-violet-500/20 bg-neutral-900/90'
          : 'w-[260px] sm:w-[290px] h-[400px] sm:h-[430px] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] opacity-75 hover:opacity-90 bg-neutral-900/90'
      }`}
    >
      <div className="relative w-full h-full">

        {/* Top Floating Controls (Center Card only) */}
        {isCenter && (
          <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-center z-20">
            {/* Real functional Expand button in dark glassmorphism */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpand(photo);
              }}
              title="Agrandir en plein écran (Espace)"
              className="bg-black/60 hover:bg-violet-600 hover:text-white backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-violet-400 group-hover:text-white" />
              <span>Agrandir</span>
            </button>

            {/* Category Pill with Violet Accent */}
            <span className="bg-black/60 backdrop-blur-md border border-white/20 text-violet-300 text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-orange-400" />
              {photo.categoryLabel}
            </span>
          </div>
        )}

        {/* Real User Photo */}
        <img
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={photo.src}
          alt={photo.title}
          loading="lazy"
        />

        {/* Gradient dark overlay on photo bottom for crisp readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

        {/* Card Details */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left pointer-events-none">
          <div className="flex justify-between items-end mb-1.5">
            <h2 className={`font-heading font-bold text-white tracking-wide truncate ${isCenter ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
              {photo.title}
            </h2>
            {isCenter && (
              <span className="text-[11px] text-orange-400 font-mono font-bold mb-1 shrink-0 ml-2">
                {currentIndex} / {totalItems}
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed font-light mb-3">
            {photo.description}
          </p>

          {/* Technical Shooting Details */}
          <div className="flex items-center justify-between text-[11px] font-mono border-t border-white/15 pt-2.5">
            <div className="flex items-center gap-1.5 text-violet-300 truncate">
              <Camera className="w-3.5 h-3.5 shrink-0 text-orange-400" />
              <span className="truncate">{photo.camera}</span>
            </div>
            {isCenter && (
              <span className="text-white/50 text-[10px] shrink-0 ml-2 hidden sm:inline">
                {photo.settings}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Card;