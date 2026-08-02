import React, { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Banner } from '../types';

interface HeroCarouselProps {
  banners: Banner[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners }) => {
  const N = banners ? banners.length : 0;

  // Start at the index of the first slide of the middle copy (which is N)
  const [activeIndex, setActiveIndex] = useState(N);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Touch and Drag state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause auto-triggering for a delay after user interaction
  const pauseAutoPlayTemporarily = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000); // 6 seconds pause after finger release
  };

  // Auto-play timer (paused whenever user is touching, dragging, or hovering)
  useEffect(() => {
    if (N <= 1 || isDragging || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [N, isDragging, isPaused, activeIndex]);

  useEffect(() => {
    if (N > 0) {
      setActiveIndex(N);
    }
  }, [N]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!banners || N === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-[250px] md:h-[450px] w-full rounded-2xl md:rounded-3xl bg-neutral-200 animate-pulse flex items-center justify-center" />
      </div>
    );
  }

  // Multiply the banners array to create 3 copies [A, B, C, A, B, C, A, B, C]
  // This guarantees seamless infinite looping in both directions.
  const displayBanners = [...banners, ...banners, ...banners];

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

  // Touch / Drag event handlers
  const handleDragStart = (clientX: number) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    setTouchStartX(clientX);
    setTouchDeltaX(0);
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || touchStartX === null) return;
    const delta = clientX - touchStartX;
    setTouchDeltaX(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 40; // minimum drag pixels to trigger slide move
    if (touchDeltaX < -threshold) {
      handleNext();
    } else if (touchDeltaX > threshold) {
      handlePrev();
    } else {
      setIsTransitionEnabled(true);
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
    pauseAutoPlayTemporarily();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    // Prevent navigating if user was swiping/dragging
    if (Math.abs(touchDeltaX) > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Map activeIndex back to active dot index (0 to N-1)
  const activeDotIndex = activeIndex % N;

  return (
    <section 
      id="hero" 
      className="relative overflow-hidden bg-neutral-50 py-2 md:py-3 select-none"
    >
      <div className="relative mx-auto max-w-[1600px] overflow-hidden">
        
        {/* Track Slider Container with standard layout */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden w-full px-4 md:px-8 touch-pan-y cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (isDragging) {
              handleDragEnd();
            } else {
              pauseAutoPlayTemporarily();
            }
          }}
        >
          <div 
            style={{
              transform: `translate3d(calc(-${activeIndex * slideWidthPercent}% + ${isDragging ? touchDeltaX : 0}px), 0, 0)`,
              transition: isDragging ? 'none' : isTransitionEnabled ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
            }}
            onTransitionEnd={handleAnimationComplete}
            className="flex flex-row w-full overflow-visible will-change-transform"
          >
            {displayBanners.map((banner, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={`${banner.id}-${index}`}
                  style={{
                    width: `${slideWidthPercent}%`,
                    flexShrink: 0,
                  }}
                  className={`px-1 md:px-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}
                >
                  {/* Banner Image wrapper */}
                  <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg shadow-neutral-200/50">
                    <div className="relative aspect-[16/9] md:aspect-[21/9] w-full bg-neutral-900">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
                        loading="eager"
                        draggable={false}
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
                            onClick={handleLinkClick}
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
                              onClick={handleLinkClick}
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
                </div>
              );
            })}
          </div>
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
