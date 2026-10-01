import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, ChevronDown, Sparkles, Film, ArrowRight } from 'lucide-react';

const HeroVideo = ({ onExploreClick }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[650px] overflow-hidden flex items-center justify-center select-none">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/hero.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      {/* Dark Cinematic Vignette & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/50 to-black/70" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-neutral-950" />

      {/* Floating Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Prestige Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-amber-400/40 text-amber-300 text-xs font-mono uppercase tracking-widest shadow-xl mb-6 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Photographie Fine Art & Célébrations Royales</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-4 leading-none">
          STUDIO <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">EZÉLIA</span>
        </h1>

        {/* Official Slogan */}
        <p className="text-xl sm:text-2xl md:text-3xl text-amber-100/90 font-light italic tracking-wide max-w-2xl mb-8">
          « L'art à portée de main »
        </p>

        {/* Short Presentation */}
        <p className="text-sm sm:text-base text-white/70 max-w-xl font-light leading-relaxed mb-10 hidden sm:block">
          Immortalisez la grâce de vos mariages coutumiers, l'émotion des cérémonies civiles et la splendeur de vos traditions avec un regard d'artiste.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onExploreClick}
            className="group px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-neutral-950 font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <span>Découvrir la Galerie</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={toggleSound}
            className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-white/70" />
                <span>Activer le son</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Couper le son</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <button
        onClick={onExploreClick}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/50 hover:text-amber-300 transition-colors cursor-pointer group"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">Faire défiler</span>
        <ChevronDown className="w-5 h-5 animate-bounce group-hover:translate-y-1 transition-transform" />
      </button>
    </section>
  );
};

export default HeroVideo;
