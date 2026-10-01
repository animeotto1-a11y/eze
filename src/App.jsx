import React, { useState } from 'react';
import Header from './components/Header';
import HeroVideo from './components/HeroVideo';
import FeaturedCarousel3D from './components/FeaturedCarousel3D';
import ShowcaseGallery from './components/ShowcaseGallery';
import Laptop3D from './components/Laptop3D';
import Lightbox from './components/Lightbox';
import { PHOTOS_DATA } from './data/photos';

const App = () => {
  // 1. Separate the 4 featured masterworks from the 22 remaining photos
  // Masterwork IDs: 9 (Couple Royal), 2 (Baiser Sacré), 6 (Sceptre & Couronne), 26 (Mémoire N&B)
  const featuredIds = [9, 2, 6, 26];
  const featuredPhotos = featuredIds.map((id) => PHOTOS_DATA.find((p) => p.id === id) || PHOTOS_DATA[0]);
  const remainingPhotos = PHOTOS_DATA.filter((p) => !featuredIds.includes(p.id));

  // Lightbox state
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [lightboxList, setLightboxList] = useState(PHOTOS_DATA);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (photo, list = PHOTOS_DATA) => {
    const idx = list.findIndex((p) => p.id === photo.id);
    setLightboxList(list);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxPhoto(photo);
  };

  const handleCloseLightbox = () => {
    setLightboxPhoto(null);
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => {
      const nextIdx = prev > 0 ? prev - 1 : lightboxList.length - 1;
      setLightboxPhoto(lightboxList[nextIdx]);
      return nextIdx;
    });
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => {
      const nextIdx = prev < lightboxList.length - 1 ? prev + 1 : 0;
      setLightboxPhoto(lightboxList[nextIdx]);
      return nextIdx;
    });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Sticky Navigation Header */}
      <Header />

      {/* 2. Hero Section with Video (hero.mp4) */}
      <div id="hero">
        <HeroVideo onExploreClick={() => scrollTo('featured-3d')} />
      </div>

      {/* 3. Section Carrousel 3D (Seulement 4 images phares, scroll libre à la fin) */}
      <FeaturedCarousel3D
        featuredPhotos={featuredPhotos}
        onExpandPhoto={(photo) => handleOpenLightbox(photo, featuredPhotos)}
        onScrollDown={() => scrollTo('showcase-gallery')}
      />

      {/* 4. Section Défilement des 22 autres images (Style Dribbble SaaS / Showcase interactif) */}
      <ShowcaseGallery
        remainingPhotos={remainingPhotos}
        onSelectPhoto={(photo) => handleOpenLightbox(photo, remainingPhotos)}
      />

      {/* 5. Section Finale : L'Ordinateur 3D Interactif (Three.js inspiré de r3f-portfolio) */}
      <Laptop3D photos={PHOTOS_DATA} />

      {/* 6. Lightbox Plein Écran Haute Définition */}
      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          onClose={handleCloseLightbox}
          onPrev={handleLightboxPrev}
          onNext={handleLightboxNext}
          currentIndex={lightboxIndex}
          totalItems={lightboxList.length}
        />
      )}
    </div>
  );
};

export default App;