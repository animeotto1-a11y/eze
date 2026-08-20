import React from 'react'

const Card = (props) => {
  const { elem, isCenter, totalItems, currentIndex } = props;

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border transition-all duration-500 bg-neutral-900/80 backdrop-blur-xl ${
        isCenter
          ? 'w-[320px] sm:w-[360px] h-[480px] border-white/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
          : 'w-[260px] sm:w-[280px] h-[390px] border-white/10 opacity-75'
      }`}
    >
      <a href={elem.url} target="_blank" rel="noreferrer" className="block h-full w-full relative group">
        
        {/* Expand / Option buttons (Center Card only) */}
        {isCenter && (
          <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-center z-20">
            <span className="bg-black/40 backdrop-blur-md border border-white/20 text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 text-white/80">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Expand
            </span>
            <span className="w-7 h-7 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-xs text-white/80">
              •••
            </span>
          </div>
        )}

        {/* Dynamic API Image */}
        <img
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={elem.download_url}
          alt={elem.author}
          loading="lazy"
        />

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

        {/* Card Details */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
          
          <div className="flex justify-between items-end mb-1">
            <h2 className={`font-bold text-white truncate ${isCenter ? 'text-2xl' : 'text-lg'}`}>
              {elem.author}
            </h2>
            {isCenter && (
              <span className="text-xs text-white/50 font-mono mb-1">
                {currentIndex}/{totalItems}
              </span>
            )}
          </div>

          <p className="text-xs text-white/60 line-clamp-2 leading-relaxed font-light mb-3">
            High quality shot captured by {elem.author}. Dimensions available at {elem.width} × {elem.height} pixels.
          </p>

          <div className="flex items-center text-[11px] text-green-400 font-mono gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Picsum ID: {elem.id}</span>
          </div>

        </div>

      </a>
    </div>
  )
}

export default Card