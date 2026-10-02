import React, { useState, useMemo } from 'react';
import { Sparkles, Maximize2, Camera } from 'lucide-react';
import { CATEGORIES } from '../data/photos';

const ShowcaseGallery = ({ remainingPhotos, onSelectPhoto }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return remainingPhotos;
    return remainingPhotos.filter((p) => p.category === selectedCategory);
  }, [remainingPhotos, selectedCategory]);

  return (
    <section id="showcase-gallery" className="relative w-full py-20 px-4 sm:px-8 bg-neutral-950 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-violet-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-orange-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Collection Intégrale — 22 Œuvres Sélectionnées</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white">
          La Traversée des <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">Émotions</span>
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 font-medium mt-3 max-w-xl mx-auto">
          Chaque image est un instant de vie capturé dans sa vérité la plus pure. Cliquez sur n'importe quel cliché pour l'admirer en haute définition.
        </p>

        {/* Category Filters with EternaCloud Gradient Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 text-white shadow-lg shadow-violet-500/30 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 shadow-sm'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Cinematic Sliding Ribbon (Infinite Preview Stream) */}
      <div className="w-full overflow-hidden mb-14 py-4 relative group">
        <div className="flex gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] w-max">
          {remainingPhotos.concat(remainingPhotos).slice(0, 16).map((photo, i) => (
            <div
              key={`ribbon-${photo.id}-${i}`}
              onClick={() => onSelectPhoto(photo)}
              className="relative w-48 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 hover:border-violet-400 shadow-xl transition-all duration-500 cursor-pointer shrink-0 hover:scale-105 group/item bg-neutral-900"
            >
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-70 group-hover/item:opacity-90 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[10px] font-mono font-bold text-orange-400 block mb-0.5">
                  {photo.categoryLabel}
                </span>
                <p className="font-heading text-sm font-bold text-white truncate">
                  {photo.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern SaaS / Masonry Interactive Grid in Dark Luxury Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">
        {filtered.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onSelectPhoto(photo)}
            className="group relative rounded-3xl overflow-hidden bg-neutral-900/90 border border-white/10 hover:border-violet-500/60 transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(124,58,237,0.25)] cursor-pointer flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-black">
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Top Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Sparkles className="w-2.5 h-2.5 text-orange-400" />
                  {photo.categoryLabel}
                </span>
              </div>

              {/* Hover Zoom Icon with Violet-to-Orange Gradient */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-orange-500 text-white flex items-center justify-center shadow-xl">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Content Details in Dark Slate */}
            <div className="p-5 text-left flex-grow flex flex-col justify-between bg-neutral-900/90">
              <div>
                <h3 className="font-heading text-lg font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                  {photo.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                  {photo.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 text-violet-300 font-medium truncate">
                  <Camera className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">{photo.camera}</span>
                </span>
                <span className="shrink-0 ml-2 text-neutral-500">{photo.settings}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShowcaseGallery;
