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
    <section id="showcase-gallery" className="relative w-full py-20 px-4 sm:px-8 bg-slate-50 text-slate-900 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-violet-400/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-orange-400/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Collection Intégrale — 22 Œuvres Sélectionnées</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
          La Traversée des <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">Émotions</span>
        </h2>

        <p className="text-sm sm:text-base text-slate-600 font-medium mt-3 max-w-xl mx-auto">
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
                    ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 text-white shadow-md shadow-violet-500/25 scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-sm'
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
              className="relative w-48 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200/90 hover:border-violet-400 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer shrink-0 hover:scale-105 group/item bg-white"
            >
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-70 group-hover/item:opacity-90 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[10px] font-mono font-bold text-orange-300 block mb-0.5">
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

      {/* Modern SaaS / Masonry Interactive Grid in Light Luxury Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">
        {filtered.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onSelectPhoto(photo)}
            className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 hover:border-violet-400 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(124,58,237,0.16)] cursor-pointer flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

              {/* Top Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-md border border-slate-200 text-violet-800 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5 text-orange-500" />
                  {photo.categoryLabel}
                </span>
              </div>

              {/* Hover Zoom Icon with Violet-to-Orange Gradient */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-orange-500 text-white flex items-center justify-center shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Content Details in Light Slate */}
            <div className="p-5 text-left flex-grow flex flex-col justify-between bg-white">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors truncate">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                  {photo.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5 text-violet-700 font-medium truncate">
                  <Camera className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">{photo.camera}</span>
                </span>
                <span className="shrink-0 ml-2 text-slate-400">{photo.settings}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShowcaseGallery;
