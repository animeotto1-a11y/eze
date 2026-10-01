import React from 'react';
import { Sparkles, Film, Box, Grid, Monitor, Phone } from 'lucide-react';

const Header = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full select-none">
      <div className="bg-neutral-950/80 backdrop-blur-2xl border border-amber-500/20 rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4">
        
        {/* Brand & Slogan */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-[1.5px] shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m14.31 8 5.74 9.94" />
                <path d="M9.69 8h11.48" />
                <path d="m7.38 12 5.74-9.94" />
                <path d="M9.69 16 3.95 6.06" />
                <path d="M14.31 16H2.83" />
                <path d="m16.62 12-5.74 9.94" />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-wider text-white uppercase font-serif">
              Studio <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">Ezélia</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-amber-200/80 italic font-light tracking-wide">
              « L'art à portée de main »
            </p>
          </div>
        </div>

        {/* Section Quick Links */}
        <nav className="hidden md:flex items-center gap-1.5 font-mono text-xs text-white/70">
          <button
            onClick={() => scrollTo('featured-3d')}
            className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span>Galerie 3D (4 Photos)</span>
          </button>

          <button
            onClick={() => scrollTo('showcase-gallery')}
            className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Grid className="w-3.5 h-3.5 text-amber-400" />
            <span>Collection (22 Photos)</span>
          </button>

          <button
            onClick={() => scrollTo('laptop-3d-experience')}
            className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Monitor className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio 3D</span>
          </button>
        </nav>

        {/* Fast Action CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollTo('laptop-3d-experience')}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Phone className="w-3 h-3" />
            <span className="hidden sm:inline">Réserver</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
