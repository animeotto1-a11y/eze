import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { Camera, ChevronLeft, ChevronRight, Crown, Power } from 'lucide-react';
import { PHOTOS_DATA } from '../../data/photos';

export default function StudioScreen({
  isPoweredOn,
  onTogglePower,
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('20:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const activePhoto = PHOTOS_DATA[selectedPhotoIndex % PHOTOS_DATA.length] || PHOTOS_DATA[0];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : PHOTOS_DATA.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev < PHOTOS_DATA.length - 1 ? prev + 1 : 0));
  };

  return (
    <Html
      transform
      distanceFactor={0.59}
      position={[0.0, 1.58, -1.58]}
      rotation-x={-0.256}
      className="select-none pointer-events-auto"
    >
      <div className="w-[2070px] h-[1300px] bg-neutral-950 text-white rounded-[22px] overflow-hidden flex flex-col font-sans border-2 border-neutral-800 shadow-2xl relative">
        {/* If screen is powered OFF: sleek black glass standby mode */}
        {!isPoweredOn && (
          <div
            onClick={onTogglePower}
            className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-neutral-900 group"
          >
            <div className="w-28 h-28 rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-amber-400 transition-all shadow-2xl shadow-amber-500/20">
              <Power className="w-14 h-14 text-amber-400 animate-pulse" />
            </div>
            <h3 className="font-serif text-4xl font-bold text-white mb-2">
              Studio Ezélia • Écran en Veille
            </h3>
            <p className="text-amber-300 text-xl font-mono">
              Cliquez ici ou sur le bouton POWER pour allumer l'ordinateur
            </p>
          </div>
        )}

        {/* If screen is powered ON: Studio Ezélia Luxury Masterwork OS */}
        {isPoweredOn && (
          <>
            {/* Top macOS / Luxury Menu Bar */}
            <div className="h-14 bg-black/90 backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between text-lg z-20">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-red-500/80 inline-block" />
                  <div className="w-4 h-4 rounded-full bg-yellow-500/80 inline-block" />
                  <div className="w-4 h-4 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="flex items-center gap-3 font-serif font-bold text-amber-300 text-xl tracking-wider">
                  <Crown className="w-6 h-6 text-amber-400" />
                  <span>STUDIO EZÉLIA OS</span>
                </div>
                <span className="text-white/30">|</span>
                <span className="text-amber-100/90 font-light italic text-base">
                  « L'art à portée de main »
                </span>
              </div>

              <div className="flex items-center gap-8 text-base text-white/80 font-mono">
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
                  CONNECTÉ
                </span>
                <span>Abidjan (GMT+0)</span>
                <span>{currentTimeStr}</span>
                <span className="px-4 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/40 font-bold text-sm">
                  COLLECTION VIP
                </span>
              </div>
            </div>

            {/* Main Stage: Full-Bleed Royal Photo View */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
              {/* Photo Image */}
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />

              {/* Ambient Glow & Edge Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30 pointer-events-none" />

              {/* Photo Index Tag */}
              <div className="absolute top-8 right-8 z-10">
                <span className="px-5 py-2.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-base font-mono text-amber-300 shadow-2xl">
                  Photo {activePhoto.id} sur 26
                </span>
              </div>

              {/* Photo Caption & Navigation Bar at Bottom */}
              <div className="absolute bottom-10 left-12 right-12 flex items-end justify-between z-10">
                <div className="max-w-2xl bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/15 shadow-2xl">
                  <span className="text-sm font-mono uppercase tracking-widest text-amber-400 font-bold">
                    {activePhoto.subtitle || activePhoto.category}
                  </span>
                  <h2 className="font-serif text-4xl font-bold text-white mt-1">
                    {activePhoto.title}
                  </h2>
                  <p className="text-base text-neutral-300 mt-2 line-clamp-2">
                    {activePhoto.description}
                  </p>
                </div>

                {/* Next / Previous Arrow Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrev}
                    className="w-16 h-16 rounded-full bg-black/70 hover:bg-amber-500 hover:text-black border-2 border-white/30 flex items-center justify-center text-white transition-all cursor-pointer shadow-2xl hover:scale-110"
                    title="Photo Précédente"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-16 h-16 rounded-full bg-black/70 hover:bg-amber-500 hover:text-black border-2 border-white/30 flex items-center justify-center text-white transition-all cursor-pointer shadow-2xl hover:scale-110"
                    title="Photo Suivante"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Html>
  );
}
