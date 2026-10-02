import React, { useState } from 'react';
import Header from './components/Header';
import HeroVideo from './components/HeroVideo';
import FeaturedCarousel3D from './components/FeaturedCarousel3D';
import ShowcaseGallery from './components/ShowcaseGallery';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import { PHOTOS_DATA } from './data/photos';

const App = () => {
  // 1. Separate the 4 featured masterworks from the 22 remaining photos
  // Masterwork IDs: 9 (Couple Royal), 2 (Baiser Sacré), 6 (Sceptre & Couronne), 26 (Mémoire N&B)
  const featuredIds = [9, 2, 6, 26];
  const featuredPhotos = featuredIds.map((id) => PHOTOS_DATA.find((p) => p.id === id) || PHOTOS_DATA[0]);

  // Lightbox state for HD full-screen viewing
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
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-violet-500/30 selection:text-violet-200 relative overflow-x-hidden">
      {/* 1. Navigation Header */}
      <Header />

      {/* 2. Section Vidéo : Expérience cinématique fluide */}
      <div id="hero">
        <HeroVideo onExploreClick={() => scrollTo('featured-3d')} />
      </div>

      {/* 3. Section Carrousel 3D : Les 4 Œuvres Majeures */}
      <FeaturedCarousel3D
        featuredPhotos={featuredPhotos}
        onExpandPhoto={(photo) => handleOpenLightbox(photo, featuredPhotos)}
        onScrollDown={() => scrollTo('showcase-gallery')}
      />

      {/* 4. Section Galerie Complète : Toutes les photos de la collection */}
      <ShowcaseGallery
        remainingPhotos={PHOTOS_DATA}
        onSelectPhoto={(photo) => handleOpenLightbox(photo, PHOTOS_DATA)}
      />

      {/* 5. Pied de page épuré */}
      <Footer />

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