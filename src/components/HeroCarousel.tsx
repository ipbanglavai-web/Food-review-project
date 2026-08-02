import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, ExternalLink } from 'lucide-react';
import { Banner } from '../types';

interface HeroCarouselProps {
  banners: Banner[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners }) => {
  const N = banners.length;

  if (!banners || N === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-[250px] md:h-[450px] w-full rounded-2xl bg-neutral-100 animate-pulse flex items-center justify-center text-neutral-400">
          No banners configured
        </div>
      </div>
    );
  }

  // Multiply the banners array to create 3 copies [A, B, C, A, B, C, A, B, C]
  // This guarantees seamless infinite looping in both directions.
  const displayBanners = [...banners, ...banners, ...banners];

  // Start at the index of the first slide of the middle copy (which is N)
  const [activeIndex, setActiveIndex] = useState(N);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const slideWidthPercent = isMobile ? 92 : 76;

  const handleNext = () => {
    setIsTransitionEnabled(true);
    setActiveIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitionEnabled(true);
    setActiveIndex((prev) => prev - 1);
  };

  const handleAnimationComplete = () => {
    // If we've reached the third copy or the first copy boundaries, reset silently
    if (activeIndex >= 2 * N) {
      setIsTransitionEnabled(false);
      setActiveIndex(activeIndex - N);
    } else if (activeIndex < N) {
      setIsTransitionEnabled(false);
      setActiveIndex(activeIndex + N);
    }
  };

  useEffect(() => {
    if (!isTransitionEnabled) {
      // Force instant jump, then re-enable transition for subsequent moves
      const frame = requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitionEnabled]);

  // Map activeIndex back to active dot index (0 to N-1)
  const activeDotIndex = activeIndex % N;

  return (
    <section 
      id="hero" 
      className="relative overflow-hidden bg-neutral-50 py-4 md:py-6"
    >
      <div className="relative mx-auto max-w-[1600px] overflow-hidden">
        
        {/* Track Slider Container with standard layout */}
        <div className="relative overflow-hidden w-full px-4 md:px-8">
          <motion.div 
            animate={{
              x: `-${activeIndex * slideWidthPercent}%`
            }}
            onAnimationComplete={handleAnimationComplete}
            transition={
              isTransitionEnabled
                ? { type: 'spring', damping: 25, stiffness: 110 }
                : { duration: 0 }
            }
            className="flex flex-row w-full overflow-visible"
          >
            {displayBanners.map((banner, index) => {
              const isActive = index === activeIndex;
              return (
                <motion.div
                  key={`${banner.id}-${index}`}
                  style={{
                    width: `${slideWidthPercent}%`,
                    flexShrink: 0,
                  }}
                  animate={{
                    scale: isActive ? 1 : 0.96,
                    opacity: isActive ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.4 }}
                  className="px-1 md:px-2" // Elegant slide padding
                >
                  {/* Banner Image wrapper */}
                  <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg shadow-neutral-200/50">
                    <div className="relative aspect-[16/9] md:aspect-[21/9] w-full bg-neutral-900">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                        loading="eager"
                      />
                      
                      {/* Premium Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8" />
                      
                      {/* Floating Indicator Badge */}
                      <div className="absolute top-4 left-4 bg-red-600/95 backdrop-blur-md text-white text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-red-600/30">
                        Featured Review
                      </div>

                      {/* Content inside Cover */}
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 text-white space-y-1.5 sm:space-y-3">
                        <h2 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight max-w-3xl font-sans drop-shadow-sm line-clamp-2">
                          {banner.title}
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-3 pt-0.5">
                          <a
                            href={banner.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs font-black tracking-wide text-white uppercase transition hover:bg-red-700 shadow-md shadow-red-600/20"
                          >
                            <Play size={12} fill="white" />
                            Watch Video Review
                          </a>
                          
                          {banner.linkUrl && (
                            <a
                              href={banner.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white uppercase transition hover:bg-white/30"
                            >
                              Details
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Carousel Indicators / Dots */}
        <div className="mt-5 flex items-center justify-center space-x-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitionEnabled(true);
                setActiveIndex(i + N);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeDotIndex ? 'w-8 bg-red-600' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
