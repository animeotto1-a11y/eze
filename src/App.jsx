import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Card from './components/Card'

const App = () => {

  const [userData, setUserData] = useState([])
  const [index, setIndex] = useState(1)
  
  const [activeIndex, setActiveIndex] = useState(5)

  // Touch & Scroll references
  const touchStartX = useRef(0)
  const isScrolling = useRef(false)

  const getData = async () => {
    try {
      const response = await axios.get(`https://picsum.photos/v2/list?page=${index}&limit=60`);
      
      const natureImages = response.data.map((item, i) => {
        const imageId = (index - 1) * 60 + i + 10;
        return {
          id: item.id,
          author: item.author || `Nature Explorer #${imageId}`,
          width: item.width,
          height: item.height,
          url: item.url,
          // Dynamic HD Nature Image from Unsplash/Picsum seed
          download_url: `https://picsum.photos/seed/nature${imageId}/1200/800`
        }
      });

      setUserData(natureImages);
      setActiveIndex(29);
    } catch (error) {
      console.error("Error fetching data with Axios:", error);
    }
  }

  useEffect(function () {
    getData();
  }, [index])

  // Active center card navigation
  const handleCardPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleCardNext = () => {
    setActiveIndex((prev) => (prev < userData.length - 1 ? prev + 1 : prev))
  }

  // Mouse Wheel Scroll Handler
  const handleWheel = (e) => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    if (e.deltaY > 0 || e.deltaX > 0) {
      handleCardNext();
    } else if (e.deltaY < 0 || e.deltaX < 0) {
      handleCardPrev();
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 250);
  }

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 40) { // minimum swipe distance threshold
      if (diffX > 0) {
        handleCardNext(); // Swipe Left -> Show Next
      } else {
        handleCardPrev(); // Swipe Right -> Show Prev
      }
    }
  }

  // Loading Skeleton State
  let printUserData = (
    <div className="flex items-center justify-center gap-2 sm:gap-4 h-[450px] sm:h-[520px]">
      <div className="w-36 sm:w-52 h-[280px] sm:h-[380px] bg-white/5 border border-white/10 rounded-2xl animate-pulse blur-[1px]"></div>
      <div className="w-64 sm:w-80 h-[380px] sm:h-[480px] bg-white/10 border border-white/20 rounded-3xl animate-pulse shadow-2xl"></div>
      <div className="w-36 sm:w-52 h-[280px] sm:h-[380px] bg-white/5 border border-white/10 rounded-2xl animate-pulse blur-[1px]"></div>
    </div>
  )

  if (userData.length > 0) {
    printUserData = (
      <div 
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex items-center justify-center w-full h-[450px] sm:h-[523px] perspective-1000 overflow-hidden select-none"
      >
        {userData.map((elem, idx) => {
          const offset = idx - activeIndex;

          // 3D perspective calculations (Mobile Responsive Spacing & Scaling)
          let positionStyles = "";
          let zIndex = 0;

          if (offset === 0) {
            // Center Featured Card
            positionStyles = "translate-x-0 scale-90 sm:scale-100 rotate-y-0 opacity-100 filter-none shadow-2xl shadow-sky-500/20";
            zIndex = 30;
          } else if (offset === -1) {
            // Immediate Left Card
            positionStyles = "-translate-x-[150px] sm:-translate-x-[260px] md:-translate-x-[320px] scale-75 sm:scale-85 rotate-y-[22deg] opacity-60 sm:opacity-70 blur-[0.5px]";
            zIndex = 20;
          } else if (offset === 1) {
            // Immediate Right Card
            positionStyles = "translate-x-[150px] sm:translate-x-[260px] md:translate-x-[320px] scale-75 sm:scale-85 -rotate-y-[22deg] opacity-60 sm:opacity-70 blur-[0.5px]";
            zIndex = 20;
          } else if (offset === -2) {
            // Far Left Card
            positionStyles = "-translate-x-[280px] sm:-translate-x-[460px] md:-translate-x-[560px] scale-60 sm:scale-70 rotate-y-[35deg] opacity-20 sm:opacity-30 blur-[2px]";
            zIndex = 10;
          } else if (offset === 2) {
            // Far Right Card
            positionStyles = "translate-x-[280px] sm:translate-x-[460px] md:translate-x-[560px] scale-60 sm:scale-70 -rotate-y-[35deg] opacity-20 sm:opacity-30 blur-[2px]";
            zIndex = 10;
          } else {
            // Hidden outer cards
            positionStyles = offset < 0 ? "-translate-x-[500px] sm:-translate-x-[800px] scale-50 opacity-0" : "translate-x-[500px] sm:translate-x-[800px] scale-50 opacity-0";
            zIndex = 0;
          }

          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`absolute transition-all duration-700 ease-out cursor-pointer transform-gpu ${positionStyles}`}
              style={{ zIndex }}
            >
              <Card elem={elem} isCenter={offset === 0} totalItems={userData.length} currentIndex={idx + 1} />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden flex flex-col justify-between selection:bg-white/20">

      {/* Full-screen Dynamic Dynamic Center Card Background Image */}
      {userData.length > 0 && userData[activeIndex] && (
        <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000">
          <img
            key={userData[activeIndex]?.download_url}
            src={userData[activeIndex]?.download_url}
            alt=""
            className="w-full h-full object-cover scale-105 blur-[2px] transition-all duration-700 ease-in-out"
          />
          {/* Very light dark overlay to keep foreground elements readable */}
          <div className="absolute inset-0 bg-black/10 backdrop-brightness-90" />
        </div>  
      )}

      {/* Background Ambient Lighting Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[700px] h-[200px] sm:h-[400px] bg-amber-600/10 blur-[100px] sm:blur-[150px] pointer-events-none rounded-full z-0" />
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[150px] sm:h-[300px] bg-sky-500/10 blur-[90px] sm:blur-[140px] pointer-events-none rounded-full z-0" />

      {/* Top Glass Header Bar */}
      <header className="sticky top-2 sm:top-4 z-50 px-2 sm:px-4 max-w-4xl mx-auto w-full my-1 sm:my-2">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-full px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between shadow-2xl gap-1 sm:gap-2">

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-white/70 tracking-wider uppercase truncate">Gallery Explorer</span>
          </div>

          <div className="bg-black/50 border border-white/10 rounded-full px-2.5 sm:px-4 py-0.5 sm:py-1 text-[10px] sm:text-xs text-white/60 font-mono flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">picsum.photos/v2/list</span>
          </div>

          <div className="text-[10px] sm:text-xs font-mono text-white/50 hidden xs:block">
            ITEMS: {userData.length}
          </div>
        </div>
      </header>

      {/* Main 3D Perspective Gallery */}
      <main className="w-full flex-grow flex items-center justify-center my-auto relative z-10 overflow-hidden">
        {printUserData}
      </main>

      {/* Floating Controls */}
      <footer className="sticky bottom-3 sm:bottom-6 z-50 flex flex-col items-center gap-2 sm:gap-3 p-1 sm:p-2">

        {/* Thumbnail Selector Slider Dock */}
        {userData.length > 0 && (
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-4 max-w-[95vw]">
            <button
              onClick={handleCardPrev}
              disabled={activeIndex === 0}
              className="w-7 h-7 sm:w-8 sm:h-8 pb-[4px] rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition cursor-pointer text-sm sm:text-base"
            >
              ‹
            </button>

            <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/30 shrink-0">
                <img 
                  src={userData[activeIndex]?.download_url} 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="text-left">
                <p className="text-[11px] sm:text-xs font-bold leading-tight truncate max-w-[80px] sm:max-w-[100px]">
                  {userData[activeIndex]?.author}
                </p>
                <p className="text-[9px] sm:text-[10px] text-white/50 font-mono">
                  {activeIndex + 1} / {userData.length}
                </p>
              </div>
            </div>

            <button
              onClick={handleCardNext}
              disabled={activeIndex === userData.length - 1}
              className="w-7 h-7 sm:w-8 sm:h-8 pb-[4px] rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition cursor-pointer text-sm sm:text-base"
            >
              ›
            </button>
          </div>
        )}

        {/* Pagination State Logic */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 flex items-center gap-3 sm:gap-5">
          <button
            style={{ opacity: index == 1 ? 0.4 : 1 }}
            disabled={index == 1}
            className="text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 disabled:cursor-not-allowed transition cursor-pointer"
            onClick={() => {
              if (index > 1) {
                setIndex(index - 1)
                setUserData([])
              }
            }}
          >
            Prev Page
          </button>

          <span className="text-[10px] sm:text-xs font-mono text-white/70">Page {index}</span>

          <button
            className="text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            onClick={() => {
              setUserData([])
              setIndex(index + 1)
            }}
          >
            Next Page
          </button>
        </div>

      </footer>

    </div>
  )
}

export default App