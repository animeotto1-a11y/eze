import React from 'react';
import { Maximize2, Camera, Sparkles } from 'lucide-react';

const GridView = ({ photos, onSelectPhoto }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => onSelectPhoto(index)}
            className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-amber-400/50 transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(217,119,6,0.3)] cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-950">
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Top Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-black/60 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  {photo.categoryLabel}
                </span>
              </div>

              {/* Zoom Icon Button on Hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  {photo.title}
                </h3>
                <p className="text-[11px] text-white/60 line-clamp-1 mt-0.5 font-light">
                  {photo.description}
                </p>

                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
                  <span className="flex items-center gap-1 text-amber-300/80 truncate">
                    <Camera className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{photo.camera}</span>
                  </span>
                  <span>{photo.settings}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridView;
