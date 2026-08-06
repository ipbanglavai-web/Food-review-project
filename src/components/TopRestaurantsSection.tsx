import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Tag, Sparkles, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const TopRestaurantsSection: React.FC = () => {
  const { banners, currentUser } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Screen width detection for responsive auto-scroll behavior
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag and Scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Dynamic banners created by admin from Firestore/context
  const adminBanners = banners
    .filter((b) => b.position === 'top_restaurants' || (!b.position && (b.restaurantName || b.discount)))
    .map((b) => ({
      id: b.id,
      restaurantName: b.restaurantName || b.title || 'Top Restaurant',
      image: b.imageUrl || 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
      discount: b.discount || 'SPECIAL DEAL',
      tagline: b.tagline || b.subtitle || '',
      code: b.code || '',
      minOrder: b.minOrder || b.description || '',
    }));

  const allCards = adminBanners;

  // If there are no top restaurant banners, show placeholder for admin/moderator or hide for visitors
  if (allCards.length === 0) {
    if (currentUser?.role === 'admin' || currentUser?.role === 'moderator') {
      return (
        <section className="py-6 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-900">
          <div className="mx-auto max-w-7xl px-4">
            <div className="p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border-2 border-dashed border-red-300 dark:border-red-900/50 text-center space-y-3">
              <h3 className="text-base font-black text-neutral-800 dark:text-neutral-200">
                Top Restaurant Banner
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                No top restaurant offer banners uploaded yet. Please upload top restaurant banners from the admin panel.
              </p>
              <Link
                to="/admin"
                state={{ activeTab: 'banners' }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
              >
                <Edit3 size={14} /> Add Top Restaurant Banner
              </Link>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  // Determine whether auto-scroll marquee should be active:
  // - 1 banner: NEVER auto-scroll (stationary everywhere)
  // - 2 or 3 banners: Auto-scroll on mobile (< 768px), but STATIC on desktop (>= 768px)
  // - 4+ banners: Auto-scroll on ALL devices
  const shouldAutoScroll =
    allCards.length === 1
      ? false
      : isDesktop
      ? allCards.length >= 4
      : allCards.length >= 2;

  // Repeat array dynamically if auto-scrolling to ensure seamless infinite marquee looping
  const repeatCount = !shouldAutoScroll ? 1 : allCards.length <= 3 ? 5 : 3;
  const cardsToDisplay = shouldAutoScroll
    ? Array(repeatCount).fill(allCards).flat()
    : allCards;

  // Auto-scroll loop using requestAnimationFrame (only when active)
  useEffect(() => {
    if (!shouldAutoScroll) return;

    let animId: number;

    const scrollStep = () => {
      if (scrollRef.current && !isInteracting && !isMouseDown) {
        const container = scrollRef.current;
        container.scrollLeft += 0.75;

        // Seamless loop wrap when reaching end of repeated sets
        const setWidth = container.scrollWidth / repeatCount;
        if (setWidth > 0) {
          if (container.scrollLeft >= setWidth * (repeatCount - 1)) {
            container.scrollLeft -= setWidth;
          } else if (container.scrollLeft <= 5) {
            container.scrollLeft += setWidth;
          }
        }
      }
      animId = requestAnimationFrame(scrollStep);
    };

    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [shouldAutoScroll, isInteracting, isMouseDown, repeatCount]);

  // Initial scroll position alignment (only when auto-scrolling)
  useEffect(() => {
    if (!shouldAutoScroll) return;

    const alignScroll = () => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const setWidth = container.scrollWidth / repeatCount;
        if (setWidth > 0 && (container.scrollLeft <= 10 || container.scrollLeft >= setWidth * (repeatCount - 0.5))) {
          container.scrollLeft = setWidth * Math.floor(repeatCount / 2);
        }
      }
    };

    alignScroll();
    const t1 = setTimeout(alignScroll, 100);
    const t2 = setTimeout(alignScroll, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shouldAutoScroll, allCards.length, repeatCount]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setIsInteracting(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
    resumeAutoScrollAfterDelay();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  // Touch handlers for mobile fingers swiping
  const handleTouchStart = () => {
    setIsInteracting(true);
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    resumeAutoScrollAfterDelay();
  };

  const resumeAutoScrollAfterDelay = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 1500); // Smoothly resume auto scroll 1.5s after touch/drag release
  };

  return (
    <section className="w-full pt-3 pb-6 sm:pt-4 sm:pb-7 bg-neutral-50/80 border-t border-neutral-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3.5">
        {/* Header Layout: "Top Restaurants" + Horizontal Line (No Arrows as requested) */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-sans whitespace-nowrap flex items-center gap-2">
            Top Restaurants
          </h2>
          <div className="flex-1 h-[1.5px] bg-neutral-300 dark:bg-neutral-700"></div>
        </div>
      </div>

      {/* Touch & Mouse Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        onMouseDown={shouldAutoScroll ? handleMouseDown : undefined}
        onMouseLeave={shouldAutoScroll ? handleMouseLeaveOrUp : undefined}
        onMouseUp={shouldAutoScroll ? handleMouseLeaveOrUp : undefined}
        onMouseMove={shouldAutoScroll ? handleMouseMove : undefined}
        onTouchStart={shouldAutoScroll ? handleTouchStart : undefined}
        onTouchEnd={shouldAutoScroll ? handleTouchEnd : undefined}
        className={`w-full overflow-x-auto no-scrollbar py-2 px-4 sm:px-6 lg:px-8 ${
          shouldAutoScroll ? 'select-none cursor-grab active:cursor-grabbing touch-pan-x' : ''
        }`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className={`flex gap-5 items-stretch ${shouldAutoScroll ? 'w-max' : 'w-full max-w-7xl mx-auto flex-nowrap'}`}>
          {cardsToDisplay.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className="shrink-0 w-[280px] sm:w-[320px] h-[200px] relative text-white rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden border-4 border-red-600/90 hover:border-red-500 shadow-2xl group cursor-pointer bg-neutral-900 transition-transform duration-300 hover:scale-[1.02]"
            >
              {/* 100% Clear Crisp JPG Background Image with zero dark overlay */}
              <img
                src={card.image}
                alt={card.restaurantName}
                className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              />

              {/* TOP LEFT: Restaurant Name in White + Yellow Discount below */}
              <div className="z-10 flex items-start justify-between w-full">
                <div className="text-left pr-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                  <div className="text-sm sm:text-base font-black text-white leading-tight tracking-wide font-sans">
                    <span className="line-clamp-1">{card.restaurantName}</span>
                  </div>
                  {/* Discount Number in Yellow */}
                  <div className="text-xl sm:text-2xl font-black text-yellow-400 leading-none mt-0.5 tracking-tight">
                    {card.discount}
                  </div>
                </div>

                <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-400/50 shadow-lg shrink-0">
                  TOP DEAL
                </span>
              </div>

              {/* Tagline / Subtitle */}
              {card.tagline && (
                <div className="z-10 text-[11px] text-amber-100 font-bold line-clamp-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 w-fit drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] my-auto">
                  {card.tagline}
                </div>
              )}

              {/* BOTTOM: Coupon Copy Bar or Tagline Detail */}
              {card.code && card.code.trim().length > 0 ? (
                <div className="z-10 bg-neutral-950/85 backdrop-blur-md rounded-xl p-2 border border-red-500/40 shadow-xl flex items-center justify-between gap-2 mt-auto">
                  <div className="text-left min-w-0 flex-1 pl-1">
                    <div className="text-[9px] font-black uppercase text-yellow-400 tracking-wider">CODE</div>
                    <div className="text-xs sm:text-sm font-black tracking-wider text-white truncate drop-shadow-xs">
                      {card.code}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCopy(card.code, e)}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-md cursor-pointer shrink-0 border border-red-400/40 active:scale-95"
                  >
                    {copiedCode === card.code ? (
                      <>
                        <Check size={13} className="text-amber-300" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="z-10 mt-auto flex items-center justify-between pt-1">
                  {card.minOrder ? (
                    <span className="text-[11px] font-black text-amber-200 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 truncate shadow-md">
                      {card.minOrder}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


