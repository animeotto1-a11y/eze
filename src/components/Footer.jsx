import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const Footer = ({
  activePhoto,
  activeIndex,
  totalItems,
  onPrev,
  onNext,
  onExpand,
  viewMode
}) => {
  return (
    <footer className="relative z-30 flex flex-col items-center gap-4 sm:gap-6 pt-2 pb-6 px-4">
      {/* 3D Gallery Floating Controls Dock */}
      {viewMode === '3d' && activePhoto && (
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white/90 backdrop-blur-2xl border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.06)] rounded-full px-3 sm:px-5 py-2 flex items-center gap-2 sm:gap-4 max-w-[95vw]">
            
            {/* Prev Button */}
            <button
              onClick={onPrev}
              disabled={activeIndex === 0}
              title="Précédente (Touche ←)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-violet-600 hover:text-white disabled:opacity-30 flex items-center justify-center transition-all cursor-pointer text-slate-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Thumbnail Preview */}
            <div 
              onClick={() => onExpand(activePhoto)}
              title="Cliquer pour agrandir"
              className="flex items-center gap-2.5 sm:gap-3 px-1 sm:px-2 cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-violet-400 group-hover:border-orange-500 shrink-0 transition-colors shadow-sm">
                <img
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-left">
                <p className="text-[11px] sm:text-xs font-bold font-heading text-slate-900 group-hover:text-violet-600 transition-colors leading-tight truncate max-w-[100px] sm:max-w-[160px]">
                  {activePhoto.title}
                </p>
                <p className="text-[9px] sm:text-[10px] text-violet-600 font-mono font-medium">
                  {activeIndex + 1} / {totalItems} · {activePhoto.categoryLabel}
                </p>
              </div>
            </div>

            {/* Expand Button in Dock */}
            <button
              onClick={() => onExpand(activePhoto)}
              title="Plein écran (Touche Espace)"
              className="hidden xs:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-violet-50 hover:bg-violet-600 text-violet-700 hover:text-white border border-violet-200 items-center justify-center transition-all cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Next Button */}
            <button
              onClick={onNext}
              disabled={activeIndex === totalItems - 1}
              title="Suivante (Touche →)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-violet-600 hover:text-white disabled:opacity-30 flex items-center justify-center transition-all cursor-pointer text-slate-800"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* Keyboard & gesture guide */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400 tracking-wider">
            <span>Navigation : Flèches <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">→</kbd></span>
            <span>·</span>
            <span>Molette ou Glissement</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">Espace</kbd> Plein écran</span>
          </div>
        </div>
      )}

      {/* Luxury Brand Footer Bar */}
      <div className="w-full max-w-5xl border-t border-slate-200 pt-5 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500">
        <div>
          <span className="font-heading font-bold text-slate-900 tracking-wider uppercase">
            Studio <span className="bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">Ezélia</span>
          </span>
          <span className="mx-2 text-slate-300">|</span>
          <span className="italic text-slate-500 font-medium">« L'art à portée de main »</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
          <span>Mariage Royal & Civil</span>
          <span>·</span>
          <span>Portraits Fine Art</span>
          <span>·</span>
          <span>Événements</span>
        </div>

        <div className="text-[10px] text-slate-400 font-mono">
          © {new Date().getFullYear()} Studio Ezélia. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
