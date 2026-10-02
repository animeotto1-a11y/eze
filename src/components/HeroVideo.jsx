import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, Sparkles, ArrowRight, Mouse, CheckCircle } from 'lucide-react';

const HeroVideo = ({ onExploreClick }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const targetTimeRef = useRef(0);
  const rafIdRef = useRef(null);

  // Initialize video and sync with mouse-wheel scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    const handleLoadedMetadata = () => {
      setVideoLoaded(true);
      video.pause();
      video.currentTime = 0;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Scroll listener: compute scroll progress strictly from container's scroll position
    const handleScroll = () => {
      if (!containerRef.current || !video) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const rawProgress = scrolled / totalScrollable;
      const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

      setProgress(clampedProgress);
      const duration = video.duration || 10;
      targetTimeRef.current = clampedProgress * duration;
    };

    // Smooth RAF animation loop for responsive frame-by-frame scrubbing
    const updateVideoFrame = () => {
      if (video && !isNaN(video.duration) && video.duration > 0) {
        const diff = targetTimeRef.current - video.currentTime;
        if (Math.abs(diff) > 0.02) {
          video.currentTime += diff * 0.4;
        }
      }
      rafIdRef.current = requestAnimationFrame(updateVideoFrame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    rafIdRef.current = requestAnimationFrame(updateVideoFrame);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const progressPercent = Math.round(progress * 100);

  return (
    <section ref={containerRef} className="relative w-full h-[300vh] bg-neutral-950">
      {/* Sticky Fullscreen Video Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center select-none">
        {/* Crystal Clear Video without scaling or blur */}
        <video
          ref={videoRef}
          src="/hero_scrub.mp4"
          playsInline
          muted
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Deep Black Edge Vignette for Seamless Dark Integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50 pointer-events-none" />

        {/* Content Overlay - Dynamically transitions based on scroll progress */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center pointer-events-none">
          {/* Phase 1 (0% - 40%): Title & Studio Identity */}
          <div
            className="transition-all duration-700 flex flex-col items-center"
            style={{
              opacity: progress < 0.45 ? 1 : Math.max(0, 1 - (progress - 0.45) * 4),
              transform: `translateY(${progress * -40}px)`,
            }}
          >
            {/* Prestige Badge with EternaCloud Violet Accent */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-violet-500/40 text-violet-300 text-xs font-semibold uppercase tracking-wider shadow-xl mb-4 pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Fine Art & Célébrations Royales</span>
            </div>

            {/* Studio Title with EternaCloud Gradient */}
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-3 leading-none drop-shadow-2xl">
              STUDIO <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">EZÉLIA</span>
            </h1>

            {/* Official Slogan */}
            <p className="text-xl sm:text-2xl md:text-3xl text-neutral-200 font-medium italic tracking-wide max-w-2xl mb-4 drop-shadow-md">
              « L'art à portée de main »
            </p>
          </div>

          {/* Phase 2 (45% - 85%): Poetic Narrative on Movement */}
          <div
            className="transition-all duration-700 flex flex-col items-center absolute"
            style={{
              opacity:
                progress >= 0.45 && progress < 0.85
                  ? Math.min(1, (progress - 0.45) * 5)
                  : progress >= 0.85
                  ? Math.max(0, 1 - (progress - 0.85) * 6)
                  : 0,
              transform: `translateY(${(progress - 0.6) * -30}px)`,
              pointerEvents: progress >= 0.45 && progress < 0.85 ? 'auto' : 'none',
            }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-2 bg-violet-950/60 px-3 py-1 rounded-full border border-violet-500/40">
              L'Instant Éternel
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-white font-extrabold max-w-3xl leading-tight drop-shadow-2xl mb-4">
              Chaque seconde est un <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">chef-d'œuvre</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-xl font-medium leading-relaxed drop-shadow-md">
              La grâce des étoffes, l'éclat des regards et la splendeur des traditions révélés à votre propre rythme.
            </p>
          </div>

          {/* Phase 3 (85% - 100%): Call to explore gallery */}
          <div
            className="transition-all duration-700 flex flex-col items-center absolute"
            style={{
              opacity: progress >= 0.85 ? Math.min(1, (progress - 0.85) * 6) : 0,
              transform: `translateY(${(progress - 0.9) * -20}px)`,
              pointerEvents: progress >= 0.85 ? 'auto' : 'none',
            }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-medium uppercase tracking-wider mb-4 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scène Complète Déroulée</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl text-white font-black mb-4 drop-shadow-2xl">
              Pénétrez au Cœur de la <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">Collection</span>
            </h2>
            <button
              onClick={onExploreClick}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-2xl shadow-violet-500/30 flex items-center gap-2 cursor-pointer hover:scale-105 pointer-events-auto"
            >
              <span>Découvrir le Carrousel 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Scroll Prompt & Live Scrub Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5 pointer-events-auto">
          {/* Scroll instruction indicator in Dark Glassmorphism */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono shadow-2xl">
            <Mouse className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span className="hidden sm:inline">Tournez la roulette de la souris pour animer :</span>
            <span className="sm:hidden">Défilez :</span>
            <span className="text-orange-400 font-bold">{progressPercent}%</span>
          </div>

          {/* Minimal visual progress bar */}
          <div className="w-48 sm:w-64 h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-orange-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Down Chevron */}
          <button
            onClick={onExploreClick}
            className="flex items-center gap-1 text-[11px] font-medium text-white/50 hover:text-violet-300 transition-colors uppercase tracking-widest cursor-pointer mt-1"
          >
            <span>Passer à la galerie</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;
