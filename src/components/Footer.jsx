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
          <div className="bg-neutral-950/80 backdrop-blur-2xl border border-amber-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-full px-3 sm:px-5 py-2 flex items-center gap-2 sm:gap-4 max-w-[95vw]">
            
            {/* Prev Button */}
            <button
              onClick={onPrev}
              disabled={activeIndex === 0}
              title="Précédente (Touche ←)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black disabled:opacity-30 flex items-center justify-center transition-all cursor-pointer text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Thumbnail Preview */}
            <div 
              onClick={() => onExpand(activePhoto)}
              title="Cliquer pour agrandir"
              className="flex items-center gap-2.5 sm:gap-3 px-1 sm:px-2 cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-amber-400/50 group-hover:border-amber-400 shrink-0 transition-colors shadow-md">
                <img
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-left">
                <p className="text-[11px] sm:text-xs font-bold font-serif text-white group-hover:text-amber-300 transition-colors leading-tight truncate max-w-[100px] sm:max-w-[160px]">
                  {activePhoto.title}
                </p>
                <p className="text-[9px] sm:text-[10px] text-amber-300/80 font-mono">
                  {activeIndex + 1} / {totalItems} · {activePhoto.categoryLabel}
                </p>
              </div>
            </div>

            {/* Expand Button in Dock */}
            <button
              onClick={() => onExpand(activePhoto)}
              title="Plein écran (Touche Espace)"
              className="hidden xs:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-400/30 items-center justify-center transition-all cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Next Button */}
            <button
              onClick={onNext}
              disabled={activeIndex === totalItems - 1}
              title="Suivante (Touche →)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black disabled:opacity-30 flex items-center justify-center transition-all cursor-pointer text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* Keyboard & gesture guide */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-wider">
            <span>Navigation : Flèches <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">→</kbd></span>
            <span>·</span>
            <span>Molette ou Glissement tactile</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">Espace</kbd> Plein écran</span>
          </div>
        </div>
      )}

      {/* Luxury Brand Footer Bar */}
      <div className="w-full max-w-5xl border-t border-white/10 pt-5 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-white/60">
        <div>
          <span className="font-serif font-bold text-white tracking-wider uppercase">
            Studio <span className="text-amber-400">Ezélia</span>
          </span>
          <span className="mx-2 text-white/20">|</span>
          <span className="italic text-amber-200/70">« L'art à portée de main »</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-white/50">
          <span>Mariage Royal & Civil</span>
          <span>·</span>
          <span>Portraits Fine Art</span>
          <span>·</span>
          <span>Événements</span>
        </div>

        <div className="text-[10px] text-white/40 font-mono">
          © {new Date().getFullYear()} Studio Ezélia. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
