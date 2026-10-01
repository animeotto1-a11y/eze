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
      className={`relative rounded-3xl overflow-hidden border transition-all duration-500 bg-neutral-950/90 backdrop-blur-xl group select-none ${
        isCenter
          ? 'w-[320px] sm:w-[380px] h-[490px] sm:h-[530px] border-amber-400/40 shadow-[0_30px_70px_-15px_rgba(217,119,6,0.35)] ring-1 ring-amber-400/20'
          : 'w-[260px] sm:w-[290px] h-[400px] sm:h-[430px] border-white/10 opacity-75 hover:opacity-90'
      }`}
    >
      <div className="relative w-full h-full">

        {/* Top Floating Controls (Center Card only) */}
        {isCenter && (
          <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-center z-20">
            {/* Real functional Expand button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpand(photo);
              }}
              title="Agrandir en plein écran (Espace)"
              className="bg-black/60 hover:bg-amber-500 hover:text-black backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Agrandir</span>
            </button>

            {/* Category Pill */}
            <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
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

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

        {/* Card Details */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left pointer-events-none">
          <div className="flex justify-between items-end mb-1.5">
            <h2 className={`font-serif font-bold text-white tracking-wide truncate ${isCenter ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
              {photo.title}
            </h2>
            {isCenter && (
              <span className="text-[11px] text-amber-300/80 font-mono mb-1 shrink-0 ml-2">
                {currentIndex} / {totalItems}
              </span>
            )}
          </div>

          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-light mb-3">
            {photo.description}
          </p>

          {/* Technical Shooting Details */}
          <div className="flex items-center justify-between text-[11px] font-mono border-t border-white/10 pt-2.5">
            <div className="flex items-center gap-1.5 text-amber-300/90 truncate">
              <Camera className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="truncate">{photo.camera}</span>
            </div>
            {isCenter && (
              <span className="text-white/40 text-[10px] shrink-0 ml-2 hidden sm:inline">
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