import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { Sparkles, Camera, Phone, MapPin, ChevronLeft, ChevronRight, Crown, Maximize2 } from 'lucide-react';
import { PHOTOS_DATA } from '../../data/photos';

export default function StudioScreen({
  isOpen,
  isPoweredOn,
  isFinishedBooting,
  bootScreenRef,
  screenRef,
  onOpenPhotoDetail,
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
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

  const filteredPhotos =
    activeCategory === 'all'
      ? PHOTOS_DATA
      : PHOTOS_DATA.filter((p) => p.category === activeCategory);

  const activePhoto = filteredPhotos[selectedPhotoIndex % filteredPhotos.length] || PHOTOS_DATA[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  };

  if (!isOpen || !isPoweredOn) {
    return null;
  }

  return (
    <>
      {/* 1. Linux / Tech Boot Screen */}
      {!isFinishedBooting && (
        <Html
          transform
          distanceFactor={0.6}
          position={[0.0, 1.59, -1.57]}
          rotation-x={-0.256}
          ref={bootScreenRef}
        >
          <div className="w-[2070px] h-[1300px] bg-black flex items-center justify-center rounded-[20px] overflow-hidden select-none">
            <img
              src="/images/boot_sequence.gif"
              alt="Booting..."
              className="w-full h-full object-cover"
            />
          </div>
        </Html>
      )}

      {/* 2. Studio Ezélia Luxury OS & VIP Showcase */}
      {isFinishedBooting && (
        <Html
          transform
          distanceFactor={0.6}
          position={[0.0, 1.59, -1.57]}
          rotation-x={-0.256}
          ref={screenRef}
        >
          <div className="w-[2070px] h-[1300px] bg-neutral-950 text-white rounded-[20px] overflow-hidden flex flex-col font-sans select-none border border-neutral-800 shadow-2xl">
            {/* macOS / Luxury OS Top Menu Bar */}
            <div className="h-14 bg-neutral-900/95 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between text-base">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500/80 inline-block" />
                  <div className="w-4 h-4 rounded-full bg-yellow-500/80 inline-block" />
                  <div className="w-4 h-4 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="flex items-center gap-3 font-serif font-bold text-amber-300 tracking-wider">
                  <Camera className="w-5 h-5 text-amber-400" />
                  <span>Studio Ezélia OS</span>
                </div>
                <span className="text-white/40">|</span>
                <span className="text-amber-100/80 font-light italic text-sm">
                  « L'art à portée de main »
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-white/70 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  LIVE
                </span>
                <span>Abidjan (GMT+0)</span>
                <span>{currentTimeStr}</span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-md border border-amber-500/30 font-sans font-semibold text-xs">
                  VIP SUITE
                </span>
              </div>
            </div>

            {/* Main Application Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-[480px] bg-neutral-900/60 border-r border-white/10 p-8 flex flex-col justify-between">
                <div>
                  {/* Brand Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20">
                      <div className="w-full h-full bg-neutral-950 rounded-2xl flex items-center justify-center">
                        <Crown className="w-8 h-8 text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                        Studio Ezélia
                      </h3>
                      <p className="text-amber-400 text-xs font-mono tracking-widest uppercase">
                        Fine Art & Célébrations
                      </p>
                    </div>
                  </div>

                  {/* Navigation Categories */}
                  <div className="space-y-2 mb-8">
                    <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3 px-3">
                      Collections Photographiques
                    </p>
                    {[
                      { id: 'all', label: 'Toutes les Œuvres (26)' },
                      { id: 'mariage', label: 'Mariages Coutumiers & Civils' },
                      { id: 'ceremonie', label: 'Cérémonies & Couronnes' },
                      { id: 'mode', label: 'Portraits Royaux & Mode' },
                      { id: 'studio', label: 'Studio Fine Art' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setSelectedPhotoIndex(0);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer flex items-center justify-between ${
                          activeCategory === cat.id
                            ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/30'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {activeCategory === cat.id && (
                          <Sparkles className="w-4 h-4 text-neutral-950" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Studio Info Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Abidjan, Côte d'Ivoire & International</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>+225 07 00 00 00 00 • Contact Privé</span>
                  </div>
                  <p className="text-xs text-amber-300/80 font-serif italic pt-1">
                    « L'art à portée de main » — Chaque instant magnifié.
                  </p>
                </div>
              </div>

              {/* Center / Right Photo Stage */}
              <div className="flex-1 p-8 flex flex-col justify-between bg-gradient-to-b from-neutral-950 to-neutral-900/80">
                {/* Active Photo Card */}
                <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group flex items-center justify-center bg-black">
                  {/* Photo Display */}
                  <img
                    src={activePhoto.src}
                    alt={activePhoto.title}
                    className="w-full h-full object-contain"
                  />

                  {/* Gradient Shadow bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Right Fullscreen Prompt */}
                  <div className="absolute top-6 right-6 flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono text-amber-300">
                      Photo {activePhoto.id} / 26
                    </span>
                  </div>

                  {/* Photo Info Banner Bottom */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                        {activePhoto.subtitle || activePhoto.category}
                      </span>
                      <h2 className="font-serif text-3xl font-bold text-white mt-1">
                        {activePhoto.title}
                      </h2>
                      <p className="text-sm text-neutral-300 max-w-lg mt-1 line-clamp-2">
                        {activePhoto.description}
                      </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer shadow-xl"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer shadow-xl"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Thumbnail Strip */}
                <div className="h-28 mt-6 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
                  {filteredPhotos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                        activePhoto.id === photo.id
                          ? 'border-amber-400 scale-105 shadow-lg shadow-amber-400/30'
                          : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}
